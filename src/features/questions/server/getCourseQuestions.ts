import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { COMMENTS_PAGE_SIZE } from "@/features/comments/constants";
import { CourseQuestionsPage } from "../types";

/**
 * Server only: the first page of questions (newest first).
 *   lessonId null → the questions about the course (the course page)
 *   lessonId      → the questions about this lesson (/learn)
 * The database returns them ready (get_course_questions): the answers nested, the best answer first.
 * null → you can't see this place (a lesson of a course you didn't buy).
 */
export const getCourseQuestions = async (
    courseId: string,
    lessonId: string | null,
): Promise<CourseQuestionsPage | null> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_course_questions", {
        p_course_id: courseId,
        p_lesson_id: lessonId,
        p_sort: "newest",
        p_limit: COMMENTS_PAGE_SIZE,
        p_offset: 0,
    });

    if (error) throw error;
    return data as CourseQuestionsPage | null;
};
