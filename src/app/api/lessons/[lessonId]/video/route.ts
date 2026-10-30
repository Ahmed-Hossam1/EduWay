import { NextResponse } from "next/server";
import { z } from "zod";
import { cloudinary, deleteCloudinaryImages, deleteCloudinaryVideos, startVideoHls } from "@/lib/cloudinary/cloudinary";
import { requireUser } from "@/lib/supabase/requireUser";
import { getLessonVideoPublicId } from "@/features/course-builder/utils";

type Params = {
    params: Promise<{ lessonId: string }>;
};

// set_lesson_video() / remove_lesson_video() errors → status + what the teacher reads
const VIDEO_ERRORS: Record<string, { status: number; message: string }> = {
    NOT_APPROVED_TEACHER: { status: 403, message: "Only approved teachers can upload videos" },
    NOT_FOUND: { status: 404, message: "Lesson not found" },
    INVALID_VIDEO: { status: 400, message: "This video can't be used" },
};

// The name Cloudinary gave back after the upload (the widget sends it)
const saveVideoSchema = z.object({
    publicId: z.string().min(1),
});

/**
 * PUT /api/lessons/:lessonId/video  { publicId } → the video was uploaded to Cloudinary:
 *   save it for the lesson ("processing") + start its HLS copy in the background
 * → { status: "processing" }                    the HLS is being made (the webhook makes it "ready")
 * → 502 { message }                             saved, but the HLS couldn't start → "failed" (the teacher can Retry)
 */
export async function PUT(request: Request, { params }: Params) {
    try {
        const { lessonId } = await params;
        if (!z.uuid().safeParse(lessonId).success) {
            return NextResponse.json({ message: "A valid lessonId is required" }, { status: 400 });
        }

        const body = await request.json();
        const result = saveVideoSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "The uploaded video name is missing" }, { status: 400 });
        }

        // 1- the uploaded file must have THIS lesson's name ("eduway/lessons/<lesson id>")
        const publicId = getLessonVideoPublicId(lessonId);
        if (result.data.publicId !== publicId) {
            console.error(
                `Lesson video name mismatch: expected "${publicId}", Cloudinary saved "${result.data.publicId}"`,
            );
            return NextResponse.json(
                { message: "The uploaded video has a wrong name. Upload it again." },
                { status: 400 },
            );
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // 2- ask Cloudinary for the video (never trust the browser): is it there? how long is it?
        let durationSeconds: number;
        try {
            // media_metadata: true → Cloudinary adds "duration" (without it, there is no duration at all)
            const video = await cloudinary.api.resource(publicId, { resource_type: "video", media_metadata: true });
            durationSeconds = Math.round(Number(video.duration ?? 0)); // 878.117 → 878
        } catch (cloudinaryError) {
            console.error(`Cloudinary lookup of "${publicId}" failed:`, cloudinaryError);
            return NextResponse.json({ message: "The video was not found on Cloudinary" }, { status: 400 });
        }

        // 3- the database saves it as "processing" (+ the lesson duration) and checks it is a lesson of HIS course
        const { data: oldPublicId, error } = await supabase.rpc("set_lesson_video", {
            p_lesson_id: lessonId,
            p_public_id: publicId,
            p_duration_seconds: durationSeconds,
        });

        if (error) {
            const known = VIDEO_ERRORS[error.message];
            if (known) return NextResponse.json({ message: known.message }, { status: known.status });
            throw error;
        }

        // 4- an older video with another name → delete it from Cloudinary
        if (oldPublicId) await deleteCloudinaryVideos([oldPublicId as string]);

        // 5- start the HLS copy (in the background). Couldn't start → "failed" → the teacher sees "Retry"
        try {
            await startVideoHls(publicId);
        } catch (hlsError) {
            console.error(`Couldn't start the HLS of "${publicId}":`, hlsError);
            await supabase.rpc("set_lesson_video_status", { p_lesson_id: lessonId, p_status: "failed" });
            return NextResponse.json(
                { message: "The video was uploaded, but preparing it failed. Try again." },
                { status: 502 },
            );
        }

        return NextResponse.json({ message: "Video uploaded", status: "processing", durationSeconds }, { status: 200 });
    } catch (error) {
        console.error("Save lesson video error:", error);
        return NextResponse.json({ message: "Failed to save the video" }, { status: 500 });
    }
}

// DELETE /api/lessons/:lessonId/video → removes the video of the lesson + its poster (database + Cloudinary)
export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { lessonId } = await params;
        if (!z.uuid().safeParse(lessonId).success) {
            return NextResponse.json({ message: "A valid lessonId is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // → { publicId, posterPublicId } (both null when there was no video)
        const { data, error } = await supabase.rpc("remove_lesson_video", { p_lesson_id: lessonId });

        if (error) {
            const known = VIDEO_ERRORS[error.message];
            if (known) return NextResponse.json({ message: known.message }, { status: known.status });
            throw error;
        }

        const removed = data as { publicId: string | null; posterPublicId: string | null };
        if (removed.publicId) await deleteCloudinaryVideos([removed.publicId]);
        if (removed.posterPublicId) await deleteCloudinaryImages([removed.posterPublicId]);

        return NextResponse.json({ message: "Video removed" }, { status: 200 });
    } catch (error) {
        console.error("Remove lesson video error:", error);
        return NextResponse.json({ message: "Failed to remove the video" }, { status: 500 });
    }
}
