import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { COURSES_PAGE_SIZE, DEFAULT_COURSES_SORT } from "../schemas/coursesQuerySchema";
import { CourseCard, CoursesResponse, GetCoursesParams } from "../types";

// What search_courses() returns (database function): one page + how many courses match in total
type SearchCoursesResult = {
    courses: CourseCard[];
    totalCount: number;
};

/**
 * Server only: returns one page of courses after search, filters and sort.
 * Used by the /courses page, the home page, the related courses and the instructor page.
 *
 * The database does the work (search_courses): it filters, sorts and returns ONLY this page,
 * so we never load all the courses into Next.js.
 */
export const getCourses = async (
    params: GetCoursesParams,
    pageSize: number = COURSES_PAGE_SIZE,
): Promise<CoursesResponse> => {
    // Default values when the param is not in the URL
    const { q, category, level, price, duration, rating, instructorId, sort = DEFAULT_COURSES_SORT, page = 1 } = params;

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("search_courses", {
        p_q: q ?? null,
        p_categories: category ?? null,
        p_levels: level ?? null,
        p_prices: price ?? null,
        p_durations: duration ?? null,
        p_min_rating: rating ?? null,
        p_instructor: instructorId ?? null,
        p_sort: sort,
        p_page: page,
        p_page_size: pageSize,
    });

    if (error) throw error;

    const { courses, totalCount } = data as SearchCoursesResult;

    return {
        courses,
        page,
        pageSize,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / pageSize)), // simple math → stays here
    };
};
