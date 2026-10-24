import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { COURSE_CARD_SELECT, CourseWithCategoriesRow, flattenCourse } from "@/features/courses/utils/flattenCourse";
import { EnrolledCourse, EnrollmentStatus } from "../types";

type EnrollmentRow = {
    status: EnrollmentStatus;
    enrolled_at: string;
    course: CourseWithCategoriesRow | null; // null = the course was unpublished (hidden by RLS)
};

// One row of get_my_completed_lessons() (database function)
type CompletedLessonsRow = {
    course_id: string;
    completed_lessons: number;
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
        .select(`status, enrolled_at, course:courses ( ${COURSE_CARD_SELECT} )`)
        .eq("user_id", user.id)
        .neq("status", "refunded")
        .order("enrolled_at", { ascending: false });

    if (error) throw error;

    // 2- how many lessons he completed in each course (counted in the database, one row per course)
    const { data: completed, error: completedError } = await supabase.rpc("get_my_completed_lessons");

    if (completedError) throw completedError;

    // [{ course_id: "abc", completed_lessons: 3 }] → { abc: 3 }
    const completedByCourse: Record<string, number> = {};
    for (const row of (completed ?? []) as CompletedLessonsRow[]) {
        completedByCourse[row.course_id] = row.completed_lessons;
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
