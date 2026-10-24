import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/getCurrentUser";
import { EnrolledCourse } from "../types";

/**
 * Server only: the "My learning" page, newest enrollment first.
 * The database does all the work (get_my_courses): the courses he owns (refunded left out),
 * how many lessons he completed in each one, and the progress %. Ready to show.
 *   [{ course, status, enrolledAt, completedLessons, progressPercent }]
 */
export const getMyCourses = async (): Promise<EnrolledCourse[]> => {
    const user = await getCurrentUser();
    if (!user) return [];

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_my_courses");

    if (error) throw error;

    return data as EnrolledCourse[];
};
