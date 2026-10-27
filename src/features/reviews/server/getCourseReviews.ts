import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { COMMENTS_PAGE_SIZE } from "@/features/comments/constants";
import { CourseReviewsPage } from "../types";

/**
 * Server only: the first page of the reviews of a course (newest first) + the summary.
 * The database returns them ready (get_course_reviews): stars count, your review, the replies nested.
 * null → the course doesn't exist or you can't see it.
 */
export const getCourseReviews = async (courseId: string): Promise<CourseReviewsPage | null> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_course_reviews", {
        p_course_id: courseId,
        p_sort: "newest",
        p_limit: COMMENTS_PAGE_SIZE,
        p_offset: 0,
    });

    if (error) throw error;
    return data as CourseReviewsPage | null;
};
