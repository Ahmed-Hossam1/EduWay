import { CategoryRow, Course } from "../types";

/**
 * The course columns every course card needs (CourseCard, cart row, My learning card).
 * Put it inside a join so all the lists ask Supabase for the SAME shape:
 *
 *   .select(`created_at, course:courses ( ${COURSE_CARD_SELECT} )`)
 *
 * The FK hint (profiles!courses_instructor_id_fkey) is needed because courses has more than one link to profiles.
 */
export const COURSE_CARD_SELECT = `
    *,
    instructor:profiles!courses_instructor_id_fkey ( id, first_name, last_name, avatar_url ),
    course_categories ( category:categories ( id, name, slug ) )
`;

/**
 * A course as Supabase returns it with COURSE_CARD_SELECT:
 * the categories are one level deeper, inside the join table course_categories.
 */
export type CourseWithCategoriesRow = Omit<Course, "categories"> & {
    course_categories: { category: CategoryRow }[];
};

/**
 * Supabase course row → the course the UI uses.
 *
 *   course_categories: [{ category: { id, name, slug } }, ...]
 *                 ↓
 *   categories:        [{ id, name, slug }, ...]
 *
 * Every other column stays the same. Works for any row that has course_categories
 * (the card rows here, and the bigger course details row in getCourseBySlug).
 */
export const flattenCourse = <T extends { course_categories: { category: CategoryRow }[] }>(row: T) => {
    const { course_categories, ...course } = row;

    return {
        ...course,
        categories: course_categories.map((item) => item.category),
    };
};

/**
 * Rows of a join table (cart_items, wishlist_items...) → the courses inside them.
 *   - a course that was unpublished after it was added comes back as null (RLS hides it) → skipped
 *   - course_categories → categories (flattenCourse)
 *
 *   const { data } = await supabase.from("cart_items").select(`created_at, course:courses ( ${COURSE_CARD_SELECT} )`);
 *   return toCourses(data ?? []);
 */
export const toCourses = (rows: { course: unknown }[]): Course[] => {
    // Supabase can't know the shape of the join → we tell it once, here
    const courses = rows.map((row) => row.course as CourseWithCategoriesRow | null);

    return courses.filter((course) => course !== null).map((course) => flattenCourse(course));
};
