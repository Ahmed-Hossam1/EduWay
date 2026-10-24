import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Course } from "@/features/courses/types";
import { COURSE_CARD_SELECT, toCourses } from "@/features/courses/utils/flattenCourse";

/**
 * Server only: the logged-in user's cart as full courses (for the /cart page), newest added first.
 * A guest gets [] (the cart page is public: he just sees an empty cart).
 * The price shown is always the CURRENT course price.
 */
export const getCartCourses = async (): Promise<Course[]> => {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from("cart_items")
        .select(`created_at, course:courses ( ${COURSE_CARD_SELECT} )`)
        .eq("user_id", user.id) // RLS allows only his rows too; this keeps it safe even if a policy changes
        .order("created_at", { ascending: false });

    if (error) throw error;

    // skips unpublished courses + course_categories → categories
    return toCourses(data ?? []);
};
