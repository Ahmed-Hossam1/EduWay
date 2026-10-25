import "server-only";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CurriculumSection } from "../types";

/**
 * Server only: the sections of a course (by position), each with its lessons (by position).
 * Returns null when the id is not a course of the logged-in teacher → the page shows 404.
 * The database builds the shape and checks the owner (get_course_curriculum uses auth.uid()).
 */
export const getCourseCurriculum = async (courseId: string): Promise<CurriculumSection[] | null> => {
    // a broken id in the URL → 404 (not a database error)
    if (!z.uuid().safeParse(courseId).success) return null;

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_course_curriculum", { p_course_id: courseId });

    if (error) throw error;
    return data as CurriculumSection[] | null;
};
