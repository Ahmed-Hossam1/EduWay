import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Course } from "@/features/courses/types";

/**
 * Server only: the most popular courses in the same category (the course's main category),
 * without the course we are looking at. The database picks them (get_related_courses → at most 4).
 */
export const getRelatedCourses = async (courseId: string): Promise<Course[]> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_related_courses", { p_course_id: courseId });

    if (error) throw error;
    return data as Course[];
};
