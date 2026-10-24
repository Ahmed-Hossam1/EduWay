import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CourseDetails } from "../types";

/**
 * Server only: one published course with everything the details page needs
 * (instructor, categories, tags, prerequisite courses, sections + lessons).
 * Returns null when the slug doesn't exist → the page shows 404.
 *
 * The database builds the whole shape (get_course_details): categories sorted by name
 * (categories[0] = the main one), sections and lessons sorted by position.
 *
 * cache() → generateMetadata and the page call it with the same slug,
 * but the database is asked only once per request.
 */
export const getCourseBySlug = cache(async (slug: string): Promise<CourseDetails | null> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_course_details", { p_slug: slug });

    if (error) throw error;
    return data as CourseDetails | null;
});
