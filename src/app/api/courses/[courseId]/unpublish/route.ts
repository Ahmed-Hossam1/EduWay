import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { checkCourseAccess } from "@/features/teacher-courses/server/checkCourseAccess";

type Params = {
    params: Promise<{ courseId: string }>;
};

// POST /api/courses/:courseId/unpublish → the course goes back to draft
// It disappears from the site for new students; the students who bought it keep it in My learning.
export async function POST(_request: Request, { params }: Params) {
    try {
        const { courseId } = await params;

        const access = await checkCourseAccess(courseId, "course:update");
        if (!access.ok) return access.response;

        if (access.course.status !== "published") {
            return NextResponse.json({ message: "Only published courses can be unpublished" }, { status: 409 });
        }

        // Admin client: the checks above already made sure it's HIS course
        const admin = createSupabaseAdminClient();
        const { error } = await admin.from("courses").update({ status: "draft" }).eq("id", courseId);

        if (error) throw error;

        return NextResponse.json({ message: "Course unpublished" }, { status: 200 });
    } catch (error) {
        console.error("Unpublish course error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
