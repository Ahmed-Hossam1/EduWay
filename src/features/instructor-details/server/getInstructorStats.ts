import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { InstructorStats } from "../types";

/**
 * Server only: the teacher's numbers from his published courses
 * (courses count, total students, weighted average rating, ratings count).
 * The database computes them (get_instructor_stats) with the SAME formula as the /instructors list.
 */
export const getInstructorStats = async (instructorId: string): Promise<InstructorStats> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_instructor_stats", { p_instructor_id: instructorId });

    if (error) throw error;
    return data as InstructorStats;
};
