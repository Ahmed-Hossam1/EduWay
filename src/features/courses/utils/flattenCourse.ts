import { CategoryRow } from "../types";

/**
 * Supabase course row → the course the UI uses.
 *
 *   course_categories: [{ category: { id, name, slug } }, ...]
 *                 ↓
 *   categories:        [{ id, name, slug }, ...]
 *
 * Every other column stays the same.
 * Only getCourseBySlug still uses it — the course lists (cart, wishlist, My learning, search)
 * get the courses ready from database functions (course_card_json / search_courses).
 */
export const flattenCourse = <T extends { course_categories: { category: CategoryRow }[] }>(row: T) => {
    const { course_categories, ...course } = row;

    return {
        ...course,
        categories: course_categories.map((item) => item.category),
    };
};
