import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Course } from "@/features/courses/types";
import { COURSE_CARD_SELECT, toCourses } from "@/features/courses/utils/flattenCourse";

/**
 * Server only: the logged-in user's wishlist as full courses (for the /wishlist page), newest saved first.
 * The page is protected (proxy.ts); a missing user still gets [] instead of an error.
 */
export const getWishlistCourses = async (): Promise<Course[]> => {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from("wishlist_items")
        .select(`created_at, course:courses ( ${COURSE_CARD_SELECT} )`)
        .eq("user_id", user.id) // RLS allows only his rows too; this keeps it safe even if a policy changes
        .order("created_at", { ascending: false });

    if (error) throw error;

    // skips unpublished courses + course_categories → categories
    return toCourses(data ?? []);
};
