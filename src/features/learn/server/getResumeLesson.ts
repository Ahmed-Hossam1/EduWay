import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Server only: the lesson to open when the student goes to /learn/[slug] ("Go to course" / "Continue").
 *   enrolled / teacher → the first lesson not done yet (all done → the first lesson)
 *   anybody else       → the first free preview lesson
 * null → no access, or nothing to watch.
 */
export const getResumeLesson = async (courseSlug: string): Promise<string | null> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_resume_lesson", { p_course_slug: courseSlug });

    if (error) throw error;
    return data as string | null;
};
