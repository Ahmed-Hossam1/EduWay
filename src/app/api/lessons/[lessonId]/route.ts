import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";
import { deleteCloudinaryVideos } from "@/lib/cloudinary/cloudinary";
import { lessonSchema } from "@/features/course-builder/schemas/curriculumSchemas";

type Params = {
    params: Promise<{ lessonId: string }>;
};

// PATCH /api/lessons/:lessonId  { title, description, isPreview } → saves the lesson dialog
export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const { lessonId } = await params;
        if (!z.uuid().safeParse(lessonId).success) {
            return NextResponse.json({ message: "A valid lessonId is required" }, { status: 400 });
        }

        const body = await request.json()
        const result = lessonSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid lesson data", errors: result.error.flatten().fieldErrors },
                { status: 400 },
            );
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // RLS: only a lesson of HIS course can change ("" description → null in the database)
        const { data: updated, error } = await supabase
            .from("lessons")
            .update({
                title: result.data.title,
                description: result.data.description || null,
                is_preview: result.data.isPreview,
            })
            .eq("id", lessonId)
            .select("id");

        if (error) throw error;
        if (updated.length === 0) return NextResponse.json({ message: "Lesson not found" }, { status: 404 });

        return NextResponse.json({ message: "Lesson saved" }, { status: 200 });
    } catch (error) {
        console.error("Update lesson error:", error);
        return NextResponse.json({ message: "Failed to save the lesson" }, { status: 500 });
    }
}

// DELETE /api/lessons/:lessonId → deletes the lesson + its video (the course numbers update by trigger)
export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { lessonId } = await params;
        if (!z.uuid().safeParse(lessonId).success) {
            return NextResponse.json({ message: "A valid lessonId is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // 1- its video (read it BEFORE the delete: the database row goes away with the lesson)
        const { data: videos } = await supabase.from("lesson_videos").select("public_id").eq("lesson_id", lessonId);

        // 2- RLS: only a lesson of HIS course can be deleted
        const { data: deleted, error } = await supabase.from("lessons").delete().eq("id", lessonId).select("id");

        if (error) throw error;
        if (deleted.length === 0) return NextResponse.json({ message: "Lesson not found" }, { status: 404 });

        // 3- the video file on Cloudinary
        await deleteCloudinaryVideos((videos ?? []).map((video) => video.public_id));

        return NextResponse.json({ message: "Lesson deleted" }, { status: 200 });
    } catch (error) {
        console.error("Delete lesson error:", error);
        return NextResponse.json({ message: "Failed to delete the lesson" }, { status: 500 });
    }
}
