import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { COURSES_PAGE_SIZE } from "../schemas/coursesQuerySchema";
import { Course, CourseDurationFilter, CoursesResponse, CourseSort, GetCoursesParams } from "../types";

// A sort function for every sort option
const sorters: Record<CourseSort, (a: Course, b: Course) => number> = {
    popular: (a, b) => b.students_count - a.students_count,
    rating: (a, b) => b.rating_avg - a.rating_avg,
    newest: (a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime(),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
};

// Is the course duration inside one of the chosen ranges?
// 14820 seconds = 4.1 hours → inside "3-10"
const isInDurationRange = (durationSeconds: number, ranges: CourseDurationFilter[]) => {
    const hours = durationSeconds / 3600;

    return ranges.some((range) => {
        if (range === "0-3") return hours < 3;
        if (range === "3-10") return hours >= 3 && hours < 10;
        return hours >= 10; // "10-plus"
    });
};

/**
 * Server only: returns one page of courses after search, filters and sort.
 * Used by the /courses page, the home page and /api/courses.
 */
export const getCourses = async (
    params: GetCoursesParams,
    pageSize: number = COURSES_PAGE_SIZE
): Promise<CoursesResponse> => {
    // Default values when the param is not in the URL
    const { q, category, level, price, duration, rating, sort = "popular", page = 1 } = params;

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

    // 2- Filter: a course stays only if it passes every filter the user chose
    const filtered = allCourses.filter((course) => {
        // search
        if (q && !course.title.toLowerCase().includes(q.toLowerCase())) return false;

        // category: the course must have at least one of the chosen categories
        if (category && !course.categories.some((c) => category.includes(c.slug))) return false;

        // level
        if (level && !level.includes(course.level)) return false;

        // price: free = 0, paid = more than 0
        const coursePrice = course.price === 0 ? "free" : "paid";
        if (price && !price.includes(coursePrice)) return false;

        // duration
        if (duration && !isInDurationRange(course.duration_seconds, duration)) return false;

        // rating: 4 → only courses rated 4 or more
        if (rating && course.rating_avg < rating) return false;

        return true;
    });

    // 3- Sort (copy first so we don't change the original array)
    const sorted = [...filtered].sort(sorters[sort]);

    // 4- Paginate
    const totalCount = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const courses = sorted.slice(from, to);

    return { courses, page, pageSize, totalCount, totalPages };
};
