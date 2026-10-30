import { NextResponse } from "next/server";
import { z } from "zod";
import { findVideoHlsUrl, startVideoHls } from "@/lib/cloudinary/cloudinary";
import { requireUser } from "@/lib/supabase/requireUser";
import { finishVideoHls } from "@/features/course-builder/server/finishVideoHls";

type Params = {
    params: Promise<{ lessonId: string }>;
};

// set_lesson_video_status() errors → status + what the teacher reads
const HLS_ERRORS: Record<string, { status: number; message: string }> = {
    NOT_APPROVED_TEACHER: { status: 403, message: "Only approved teachers can prepare videos" },
    NOT_FOUND: { status: 404, message: "This lesson has no video" },
    ALREADY_PROCESSING: { status: 409, message: "The video is already being prepared" },
};

/**
 * GET /api/lessons/:lessonId/video/hls → { status: "processing" | "ready" | "failed" }
 * The BACKUP of the webhook: the Curriculum page asks this every few seconds while a video is "processing".
 * Still processing → we ask Cloudinary ourselves; the HLS copy is there → we save it ("ready").
 * (the webhook can't reach localhost without a tunnel → the video would stay "processing" forever)
 */
export async function GET(_request: Request, { params }: Params) {
    try {
        const { lessonId } = await params;
        if (!z.uuid().safeParse(lessonId).success) {
            return NextResponse.json({ message: "A valid lessonId is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // RLS: only the teacher of the lesson can read its video
        const { data: video, error } = await supabase
            .from("lesson_videos")
            .select("public_id, status")
            .eq("lesson_id", lessonId)
            .maybeSingle();

        if (error) throw error;
        if (!video) return NextResponse.json({ message: "This lesson has no video" }, { status: 404 });
        if (video.status !== "processing") return NextResponse.json({ status: video.status }, { status: 200 });

        // still processing → is the HLS copy on Cloudinary already? (we ask Cloudinary, never the browser)
        const hlsUrl = await findVideoHlsUrl(video.public_id);
        if (!hlsUrl) return NextResponse.json({ status: "processing" }, { status: 200 });

        // the same save as the webhook (only the server may make a video "ready")
        await finishVideoHls(video.public_id, hlsUrl);
        return NextResponse.json({ status: "ready" }, { status: 200 });
    } catch (error) {
        console.error("Check lesson video HLS error:", error);
        return NextResponse.json({ message: "Couldn't check the video" }, { status: 500 });
    }
}

// POST /api/lessons/:lessonId/video/hls → "Retry": make the HLS copy again (no new upload)
//   a conversion is already running → 409 (no duplicate conversion)
export async function POST(_request: Request, { params }: Params) {
    try {
        const { lessonId } = await params;
        if (!z.uuid().safeParse(lessonId).success) {
            return NextResponse.json({ message: "A valid lessonId is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // "processing" again (the database refuses when it already is) → the video name
        const { data: publicId, error } = await supabase.rpc("set_lesson_video_status", {
            p_lesson_id: lessonId,
            p_status: "processing",
        });

        if (error) {
            const known = HLS_ERRORS[error.message];
            if (known) return NextResponse.json({ message: known.message }, { status: known.status });
            throw error;
        }

        try {
            await startVideoHls(publicId as string);
        } catch (hlsError) {
            console.error(`Couldn't start the HLS of "${publicId}":`, hlsError);
            await supabase.rpc("set_lesson_video_status", { p_lesson_id: lessonId, p_status: "failed" });
            return NextResponse.json({ message: "Preparing the video failed again. Try later." }, { status: 502 });
        }

        return NextResponse.json({ message: "Preparing the video", status: "processing" }, { status: 200 });
    } catch (error) {
        console.error("Retry lesson video HLS error:", error);
        return NextResponse.json({ message: "Failed to prepare the video" }, { status: 500 });
    }
}
