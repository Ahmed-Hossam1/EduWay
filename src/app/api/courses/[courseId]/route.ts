import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkCourseAccess } from "@/features/teacher-courses/server/checkCourseAccess";

type Params = {
    params: Promise<{ courseId: string }>;
};

// DELETE /api/courses/:courseId → deletes a DRAFT course of the logged-in teacher
// A published course is never deleted: students paid for it (unpublish it instead).
export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { courseId } = await params;

        // clear messages: 400 / 401 / 403 / 404
        const access = await checkCourseAccess(courseId, "course:delete");
        if (!access.ok) return access.response;

        if (access.course.status !== "draft") {
            return NextResponse.json({ message: "Only draft courses can be deleted" }, { status: 409 });
        }

        // RLS: a teacher can delete only HIS draft courses
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.from("courses").delete().eq("id", courseId).eq("status", "draft");

        if (error) throw error;

        return NextResponse.json({ message: "Draft deleted" }, { status: 200 });
    } catch (error) {
        console.error("Delete draft course error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
