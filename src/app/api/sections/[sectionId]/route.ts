import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";
import { deleteCloudinaryImages, deleteCloudinaryVideos } from "@/lib/cloudinary/cloudinary";
import { titleSchema } from "@/features/course-builder/schemas/curriculumSchemas";

type Params = {
    params: Promise<{ sectionId: string }>;
};

// PATCH /api/sections/:sectionId  { title } → renames the section
export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const { sectionId } = await params;
        if (!z.uuid().safeParse(sectionId).success) {
            return NextResponse.json({ message: "A valid sectionId is required" }, { status: 400 });
        }

        const body = await request.json();
        const result = titleSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Write a section title" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // RLS: only a section of HIS course can change
        const { data: updated, error } = await supabase
            .from("sections")
            .update({ title: result.data.title })
            .eq("id", sectionId)
            .select("id");

        if (error) throw error;
        if (updated.length === 0) return NextResponse.json({ message: "Section not found" }, { status: 404 });

        return NextResponse.json({ message: "Section renamed" }, { status: 200 });
    } catch (error) {
        console.error("Rename section error:", error);
        return NextResponse.json({ message: "Failed to rename the section" }, { status: 500 });
    }
}

// DELETE /api/sections/:sectionId → deletes the section, its lessons, their videos and posters (the course numbers update by trigger)
export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { sectionId } = await params;
        if (!z.uuid().safeParse(sectionId).success) {
            return NextResponse.json({ message: "A valid sectionId is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // 1- the videos + posters of its lessons (read them BEFORE the delete)
        const { data: videos } = await supabase
            .from("lesson_videos")
            .select("public_id, poster_public_id, lessons!inner(section_id)")
            .eq("lessons.section_id", sectionId);

        // 2- RLS: only a section of HIS course can be deleted
        const { data: deleted, error } = await supabase.from("sections").delete().eq("id", sectionId).select("id");

        if (error) throw error;
        if (deleted.length === 0) return NextResponse.json({ message: "Section not found" }, { status: 404 });

        // 3- the video + poster files on Cloudinary (a lesson without a poster → null → skipped)
        await deleteCloudinaryVideos((videos ?? []).map((video) => video.public_id));
        await deleteCloudinaryImages(
            (videos ?? []).map((video) => video.poster_public_id).filter((posterId) => posterId !== null),
        );

        return NextResponse.json({ message: "Section deleted" }, { status: 200 });
    } catch (error) {
        console.error("Delete section error:", error);
        return NextResponse.json({ message: "Failed to delete the section" }, { status: 500 });
    }
}
