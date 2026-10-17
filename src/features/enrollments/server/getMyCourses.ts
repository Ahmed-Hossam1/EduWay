import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CourseRow, flattenCourse } from "@/features/courses/utils/flattenCourse";
import { EnrolledCourse, EnrollmentStatus } from "../types";

type EnrollmentRow = {
    status: EnrollmentStatus;
    enrolled_at: string;
    course: CourseRow | null; // null = the course was unpublished (hidden by RLS)
};

/**
 * Server only: the logged-in user's courses for the "My courses" page,
 * newest enrollment first, with how many lessons he completed in each one.
 */
export const getMyCourses = async (): Promise<EnrolledCourse[]> => {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    // 1- his enrollments + the full course (same shape as the courses list)
    const { data: enrollments, error } = await supabase
        .from("enrollments")
        .select(
            `
            status, enrolled_at,
            course:courses (
                *,
                instructor:profiles!courses_instructor_id_fkey ( id, first_name, last_name, avatar_url ),
                course_categories ( category:categories ( id, name, slug ) )
            )
        `,
        )
        .eq("user_id", user.id)
        .neq("status", "refunded")
        .order("enrolled_at", { ascending: false });

    if (error) throw error;

    // 2- his completed lessons, with the course each lesson belongs to
    const { data: progress, error: progressError } = await supabase
        .from("lesson_progress")
        .select("lesson:lessons ( section:sections ( course_id ) )")
        .eq("user_id", user.id);

    if (progressError) throw progressError;

    // count completed lessons per course: { "course-id": 3, ... }
    const completedByCourse: Record<string, number> = {};
    for (const item of progress ?? []) {
        const courseId = (item.lesson as unknown as { section: { course_id: string } } | null)?.section?.course_id;
        if (courseId) completedByCourse[courseId] = (completedByCourse[courseId] ?? 0) + 1;
    }

    return (enrollments as unknown as EnrollmentRow[])
        .filter((item) => item.course) // a course that was unpublished is hidden by RLS → skip it
        .map((item) => {
            const course = flattenCourse(item.course!); // course_categories → categories
            const completedLessons = completedByCourse[course.id] ?? 0;
            const progressPercent =
                course.lessons_count > 0 ? Math.round((completedLessons / course.lessons_count) * 100) : 0;

            return {
                course,
                status: item.status,
                enrolledAt: item.enrolled_at,
                completedLessons,
                progressPercent,
            };
        });
};
