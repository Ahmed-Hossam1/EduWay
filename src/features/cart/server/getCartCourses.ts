import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Course } from "@/features/courses/types";
import { CourseRow, flattenCourse } from "@/features/courses/utils/flattenCourse";

/**
 * Server only: the logged-in user's cart as full courses (for the /cart page),
 * newest added first. RLS makes sure we only get HIS rows.
 * The price shown is always the CURRENT course price.
 */
export const getCartCourses = async (): Promise<Course[]> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("cart_items")
        .select(
            `
            created_at,
            course:courses (
                *,
                instructor:profiles!courses_instructor_id_fkey ( id, first_name, last_name, avatar_url ),
                course_categories ( category:categories ( id, name, slug ) )
            )
        `,
        )
        .order("created_at", { ascending: false });

    if (error) throw error;

    return (
        (data ?? [])
            // a course that was unpublished after it was added comes back as null → skip it
            .filter((item) => item.course)
            // course_categories → categories (same as the courses list)
            .map((item) => flattenCourse(item.course as unknown as CourseRow))
    );
};
