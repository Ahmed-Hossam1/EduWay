import { NextResponse } from "next/server";
import { z } from "zod";
import { cloudinary, deleteCloudinaryImages } from "@/lib/cloudinary/cloudinary";
import { requireUser } from "@/lib/supabase/requireUser";
import { getLessonPosterPublicId } from "@/features/course-builder/utils";

type Params = {
    params: Promise<{ lessonId: string }>;
};

// set_lesson_poster() / remove_lesson_poster() errors → status + what the teacher reads
const POSTER_ERRORS: Record<string, { status: number; message: string }> = {
    NOT_APPROVED_TEACHER: { status: 403, message: "Only approved teachers can upload posters" },
    NOT_FOUND: { status: 404, message: "Lesson not found" },
    NO_VIDEO: { status: 400, message: "Upload the lesson video first" },
    INVALID_POSTER: { status: 400, message: "This picture can't be used" },
};

// The name Cloudinary gave back after the upload (the widget sends it)
const savePosterSchema = z.object({
    publicId: z.string().min(1),
});

/**
 * PUT /api/lessons/:lessonId/poster  { publicId } → the picture was uploaded to Cloudinary: save it as the poster
 * (the picture the student sees before the video plays). The lesson must have a video first.
 */
export async function PUT(request: Request, { params }: Params) {
    try {
        const { lessonId } = await params;
        if (!z.uuid().safeParse(lessonId).success) {
            return NextResponse.json({ message: "A valid lessonId is required" }, { status: 400 });
        }

        const body = await request.json();
        const result = savePosterSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "The uploaded picture name is missing" }, { status: 400 });
        }

        // 1- the uploaded file must have THIS lesson's name ("eduway/lesson-posters/<lesson id>")
        const publicId = getLessonPosterPublicId(lessonId);
        if (result.data.publicId !== publicId) {
            return NextResponse.json(
                { message: "The uploaded picture has a wrong name. Upload it again." },
                { status: 400 },
            );
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // 2- ask Cloudinary for the picture (never trust the browser): is it there? what is its link?
        // secure_url has the version ("/v1793.../") → after a "Replace" the browser never shows the old picture
        let posterUrl: string;
        try {
            const image = await cloudinary.api.resource(publicId, { resource_type: "image" });
            posterUrl = image.secure_url;
        } catch (cloudinaryError) {
            console.error(`Cloudinary lookup of "${publicId}" failed:`, cloudinaryError);
            return NextResponse.json({ message: "The picture was not found on Cloudinary" }, { status: 400 });
        }

        // 3- the database saves it (and checks it is a lesson of HIS course, with a video)
        const { data: oldPublicId, error } = await supabase.rpc("set_lesson_poster", {
            p_lesson_id: lessonId,
            p_poster_url: posterUrl,
            p_poster_public_id: publicId,
        });

        if (error) {
            const known = POSTER_ERRORS[error.message];
            if (known) {
                // not saved → don't leave the uploaded picture alone on Cloudinary
                await deleteCloudinaryImages([publicId]);
                return NextResponse.json({ message: known.message }, { status: known.status });
            }
            throw error;
        }

        // 4- an older poster with another name → delete it from Cloudinary (same name = already written over)
        if (oldPublicId) await deleteCloudinaryImages([oldPublicId as string]);

        return NextResponse.json({ message: "Poster saved", posterUrl }, { status: 200 });
    } catch (error) {
        console.error("Save lesson poster error:", error);
        return NextResponse.json({ message: "Failed to save the poster" }, { status: 500 });
    }
}

// DELETE /api/lessons/:lessonId/poster → removes the poster (database + Cloudinary), the video stays
export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { lessonId } = await params;
        if (!z.uuid().safeParse(lessonId).success) {
            return NextResponse.json({ message: "A valid lessonId is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // → the removed poster public_id, or null (there was no poster)
        const { data: removedPublicId, error } = await supabase.rpc("remove_lesson_poster", {
            p_lesson_id: lessonId,
        });

        if (error) {
            const known = POSTER_ERRORS[error.message];
            if (known) return NextResponse.json({ message: known.message }, { status: known.status });
            throw error;
        }

        if (removedPublicId) await deleteCloudinaryImages([removedPublicId as string]);

        return NextResponse.json({ message: "Poster removed" }, { status: 200 });
    } catch (error) {
        console.error("Remove lesson poster error:", error);
        return NextResponse.json({ message: "Failed to remove the poster" }, { status: 500 });
    }
}
