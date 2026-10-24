import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/getCurrentUser";
import { Course } from "@/features/courses/types";

/**
 * Server only: the logged-in user's cart as full courses (the /cart page), newest added first.
 * The database does all the work (get_my_cart_courses): his rows only, unpublished courses left out,
 * each course already in the Course shape. The price is always the CURRENT course price.
 * A guest gets [] (the cart page is public: he just sees an empty cart).
 */
export const getCartCourses = async (): Promise<Course[]> => {
    const user = await getCurrentUser();
    if (!user) return [];

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_my_cart_courses");

    if (error) throw error;

    return data as Course[];
};
