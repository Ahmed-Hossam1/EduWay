import "server-only";
import { cache } from "react";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LessonPlayer } from "../types";

/**
 * Server only: everything the lesson player needs (course, curriculum, the open lesson + its video, progress).
 * Returns null when the user can't see this course / lesson → the page shows 404.
 * The database decides who can watch (get_lesson_player: enrolled / teacher / free preview).
 *
 * cache() → generateMetadata and the page share ONE database call.
 */
export const getLessonPlayer = cache(async (courseSlug: string, lessonId: string): Promise<LessonPlayer | null> => {
    // a broken lesson id in the URL → 404 (not a database error)
    if (!z.uuid().safeParse(lessonId).success) return null;

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_lesson_player", {
        p_course_slug: courseSlug,
        p_lesson_id: lessonId,
    });

    if (error) throw error;
    return data as LessonPlayer | null;
});
