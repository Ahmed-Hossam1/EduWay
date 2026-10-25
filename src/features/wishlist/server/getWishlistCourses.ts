import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/getCurrentUser";
import { CourseCard } from "@/features/courses/types";

/**
 * Server only: the logged-in user's wishlist as full courses (the /wishlist page), newest saved first.
 * The database does all the work (get_my_wishlist_courses): his rows only, unpublished courses left out,
 * each course already in the CourseCard shape.
 * The page is protected (proxy.ts); a missing user still gets [] instead of an error.
 */
export const getWishlistCourses = async (): Promise<CourseCard[]> => {
    const user = await getCurrentUser();
    if (!user) return [];

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_my_wishlist_courses");

    if (error) throw error;

    return data as CourseCard[];
};
