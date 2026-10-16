import { CategoryRow, Course } from "../types";

/**
 * A course as Supabase returns it when we select:
 *   course_categories ( category:categories ( id, name, slug ) )
 * The categories are one level deeper, inside the join table course_categories.
 */
export type CourseRow = Omit<Course, "categories"> & {
    course_categories: { category: CategoryRow }[];
};

/**
 * Supabase course row → the Course the UI uses.
 *
 *   course_categories: [{ category: { id, name, slug } }, ...]
 *                 ↓
 *   categories:        [{ id, name, slug }, ...]
 *
 * Every other column stays the same.
 * Used by getCourses, getCartCourses, getWishlistCourses and getMyCourses.
 */
export const flattenCourse = (row: CourseRow): Course => {
    const { course_categories, ...course } = row;

    return {
        ...course,
        categories: course_categories.map((item) => item.category),
    };
};
