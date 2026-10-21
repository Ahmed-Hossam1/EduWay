import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTeacherCourses } from "./getTeacherCourses";

export type TeacherEnrollmentRow = {
    enrolled_at: string;
    completed_at: string | null;
    course_id: string;
    student: { id: string; first_name: string | null; last_name: string | null } | null;
    course: { title: string } | null;
};

/**
 * Server only: every student who joined this teacher's courses (newest first).
 * cache() → stats, insight and new students share ONE query.
 */
export const getTeacherEnrollments = cache(async (teacherId: string): Promise<TeacherEnrollmentRow[]> => {
    const courses = await getTeacherCourses(teacherId);
    const courseIds = courses.map((course) => course.id);
    if (courseIds.length === 0) return [];

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("enrollments")
        .select(
            `enrolled_at, completed_at, course_id,
             student:profiles!enrollments_user_id_fkey ( id, first_name, last_name ),
             course:courses ( title )`,
        )
        .in("course_id", courseIds)
        .order("enrolled_at", { ascending: false });

    if (error) throw error;

    return data as unknown as TeacherEnrollmentRow[];
});
