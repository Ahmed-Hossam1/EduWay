import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkCourseAccess } from "@/features/teacher-courses/server/checkCourseAccess";

type Params = {
    params: Promise<{ courseId: string }>;
};

// POST /api/courses/:courseId/unpublish → the course goes back to draft
// It disappears from the site for new students; the students who bought it keep it in My learning.
export async function POST(_request: Request, { params }: Params) {
    try {
        const { courseId } = await params;

        // clear messages: 400 / 401 / 403 / 404
        const access = await checkCourseAccess(courseId, "course:update");
        if (!access.ok) return access.response;

        if (access.course.status !== "published") {
            return NextResponse.json({ message: "Only published courses can be unpublished" }, { status: 409 });
        }

        // the database changes the status only for HIS published course (false = not allowed)
        const supabase = await createSupabaseServerClient();
        const { data: unpublished, error } = await supabase.rpc("unpublish_course", { p_course_id: courseId });

        if (error) throw error;

        if (!unpublished) {
            return NextResponse.json({ message: "You can only change your own courses" }, { status: 403 });
        }

        return NextResponse.json({ message: "Course unpublished" }, { status: 200 });
    } catch (error) {
        console.error("Unpublish course error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
