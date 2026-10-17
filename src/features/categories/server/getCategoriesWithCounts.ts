import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryListItem } from "../types";

// What Supabase returns for one category (it can not guess the shape of the embedded courses)
type CategoryRow = {
    name: string;
    slug: string;
    course_categories: { courses: { status: string } | null }[];
};

/**
 * Server only: the categories for the /categories page.
 *   - counts only the PUBLISHED courses of every category (drafts are hidden from students)
 *   - hides the categories that have no published course
 *   - q = the search text from the URL (?q=design) → only the categories whose name has it
 */
export const getCategoriesWithCounts = async (q?: string): Promise<CategoryListItem[]> => {
    const supabase = await createSupabaseServerClient();

    // Every category + the status of each of its courses
    const { data, error } = await supabase
        .from("categories")
        .select("name, slug, course_categories(courses(status))")
        .order("name");

    if (error) throw error;

    // { name, slug, course_categories: [{ courses: { status } }, ...] }  →  { name, slug, coursesCount }
    const categories = (data as unknown as CategoryRow[]).map((category) => {
        const publishedCourses = category.course_categories.filter((link) => link.courses?.status === "published");

        return {
            name: category.name,
            slug: category.slug,
            coursesCount: publishedCourses.length,
        };
    });

    return categories.filter((category) => {
        // a category without courses leads to an empty page → don't show it
        if (category.coursesCount === 0) return false;

        // search (not case sensitive: "DESIGN" finds "Design & Creative")
        if (q && !category.name.toLowerCase().includes(q.toLowerCase())) return false;

        return true;
    });
};
