import "server-only";
import { cache } from "react";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CourseForEdit } from "../types";

/**
 * Server only: one course with everything the edit page needs + what is missing to publish it.
 * Returns null when the id is not a course of the logged-in teacher → the page shows 404.
 * The database checks the owner by itself (get_course_for_edit uses auth.uid()).
 *
 * cache() → the edit layout and the tab page share ONE database call per request.
 */
export const getCourseForEdit = cache(async (courseId: string): Promise<CourseForEdit | null> => {
    // a broken id in the URL → 404 (not a database error)
    if (!z.uuid().safeParse(courseId).success) return null;

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_course_for_edit", { p_course_id: courseId });

    if (error) throw error;
    return data as CourseForEdit | null;
});
