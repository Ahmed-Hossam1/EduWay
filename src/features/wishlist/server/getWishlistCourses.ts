import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryRow, Course } from "@/features/courses/types";

/**
 * Server only: the logged-in user's wishlist as full courses (for the /wishlist page),
 * newest saved first. RLS makes sure we only get HIS rows.
 */
export const getWishlistCourses = async (): Promise<Course[]> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("wishlist_items")
        .select(`
            created_at,
            course:courses (
                *,
                instructor:profiles!courses_instructor_id_fkey ( id, first_name, last_name, avatar_url ),
                course_categories ( category:categories ( id, name, slug ) )
            )
        `)
        .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? [])
        // a course that was unpublished after it was saved comes back as null → skip it
        .filter((item) => item.course)
        // same flattening as getCourses: course_categories → categories
        .map(({ course }) => {
            const { course_categories, ...rest } = course as unknown as Course & {
                course_categories: { category: CategoryRow }[];
            };
            return { ...rest, categories: course_categories.map((item) => item.category) };
        });
};
