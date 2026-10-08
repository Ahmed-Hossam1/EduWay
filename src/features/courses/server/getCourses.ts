import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { COURSES_PAGE_SIZE, CoursesQuery } from "../schemas/coursesQuerySchema";
import { Course, CoursesResponse } from "../types";

// A sort function for every sort option in the URL
const sorters: Record<CoursesQuery["sort"], (a: Course, b: Course) => number> = {
    popular: (a, b) => b.students_count - a.students_count,
    rating: (a, b) => b.rating_avg - a.rating_avg,
    newest: (a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime(),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
};

/**
 * Server only: returns one page of courses after search, filters and sort.
 * Used by the /courses page, the home page and /api/courses.
 */
export const getCourses = async (
    { q, category, level, sort, page }: CoursesQuery,
    pageSize: number = COURSES_PAGE_SIZE
): Promise<CoursesResponse> => {
    // 1- Get all published courses + their instructor + their categories
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("courses")
        .select(`
            *,
            instructor:profiles ( id, first_name, last_name, avatar_url ),
            course_categories ( category:categories ( id, name, slug ) )
        `)
        .eq("status", "published");

    if (error) throw error;

    // course_categories: [{ category: {...} }]  →  categories: [{...}]
    const allCourses: Course[] = data.map(({ course_categories, ...course }) => ({
        ...course,
        categories: course_categories.map((item: { category: Course["categories"][number] }) => item.category),
    }));

    // 2- Filter
    const filtered = allCourses.filter((course) => {
        if (q && !course.title.toLowerCase().includes(q.toLowerCase())) return false;
        if (category && !course.categories.some((c) => category.includes(c.slug))) return false;
        if (level && !level.includes(course.level)) return false;
        return true;
    });

    // 3- Sort (copy first so we don't mutate the original array)
    const sorted = [...filtered].sort(sorters[sort]);

    // 4- Paginate
    const totalCount = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const courses = sorted.slice(from, to);

    return { courses, page, pageSize, totalCount, totalPages };
};
