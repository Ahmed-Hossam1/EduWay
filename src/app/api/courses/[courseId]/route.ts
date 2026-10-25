import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteCloudinaryVideos } from "@/lib/cloudinary/cloudinary";
import { checkCourseAccess } from "@/features/teacher-courses/server/checkCourseAccess";

type Params = {
    params: Promise<{ courseId: string }>;
};

// DELETE /api/courses/:courseId → deletes a DRAFT course of the logged-in teacher
// A course with students is never deleted (published, or unpublished after people bought it).
export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { courseId } = await params;

        // clear messages: 400 / 401 / 403 / 404
        const access = await checkCourseAccess(courseId, "course:delete");
        if (!access.ok) return access.response;

        if (access.course.status !== "draft") {
            return NextResponse.json({ message: "Only draft courses can be deleted" }, { status: 409 });
        }

        const supabase = await createSupabaseServerClient();

        // the videos of all its lessons (read them BEFORE the delete)
        const { data: videos } = await supabase
            .from("lesson_videos")
            .select("public_id, lessons!inner(sections!inner(course_id))")
            .eq("lessons.sections.course_id", courseId);

        // RLS: a teacher can delete only HIS draft courses that nobody enrolled in / bought
        const { data: deleted, error } = await supabase
            .from("courses")
            .delete()
            .eq("id", courseId)
            .eq("status", "draft")
            .select("id");

        if (error) throw error;

        // nothing deleted → students own this course (it was published before)
        if (deleted.length === 0) {
            return NextResponse.json(
                { message: "Students own this course, so it can't be deleted. Keep it unpublished." },
                { status: 409 },
            );
        }

        // the video files on Cloudinary
        await deleteCloudinaryVideos((videos ?? []).map((video) => video.public_id));

        return NextResponse.json({ message: "Draft deleted" }, { status: 200 });
    } catch (error) {
        console.error("Delete draft course error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
