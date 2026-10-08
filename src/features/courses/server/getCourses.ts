import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { COURSES_PAGE_SIZE, CoursesQuery } from "../schemas/coursesQuerySchema";
import { CategoryRow, Course, CoursesResponse } from "../types";

// Columns the courses list needs + the instructor + the categories (through course_categories)
const COURSE_LIST_SELECT = `
  id, title, slug, short_description, thumbnail_url, level, price, currency, badge,
  published_at, duration_seconds, lessons_count, students_count, rating_avg, rating_count,
  instructor:profiles!courses_instructor_id_fkey ( id, first_name, last_name, avatar_url ),
  course_categories ( category:categories ( id, name, slug ) )
`;

// Extra embed used ONLY for filtering by category (!inner = keep courses that have a match)
const CATEGORY_FILTER_SELECT = `, category_filter:course_categories!inner ( category:categories!inner ( slug ) )`;

// sort value from the URL → column + direction in the database
const SORT_COLUMNS: Record<CoursesQuery["sort"], { column: string; ascending: boolean }> = {
    popular: { column: "students_count", ascending: false },
    rating: { column: "rating_avg", ascending: false },
    newest: { column: "published_at", ascending: false },
    "price-asc": { column: "price", ascending: true },
    "price-desc": { column: "price", ascending: false },
};

// Shape that Supabase returns before we flatten it
type CourseQueryRow = Omit<Course, "categories"> & {
    course_categories: { category: CategoryRow }[];
};

// "50%_off" → "50\%\_off" so the user's text is searched literally inside ILIKE
const escapeLike = (value: string) => value.replace(/[\\%_]/g, (char) => `\\${char}`);

/**
 * Server only: returns one page of published courses after search, filters and sort.
 * Used by the /courses page (server component), the home page and /api/courses.
 */
export const getCourses = async (
    { q, category, level, sort, page }: CoursesQuery,
    pageSize: number = COURSES_PAGE_SIZE
): Promise<CoursesResponse> => {
    const supabase = await createSupabaseServerClient();

    // 1- Select (+ the category join only when we filter by category)
    const select = category ? COURSE_LIST_SELECT + CATEGORY_FILTER_SELECT : COURSE_LIST_SELECT;
    let query = supabase
        .from("courses")
        .select(select, { count: "exact" })
        .eq("status", "published");

    // 2- Filters
    if (q) query = query.ilike("title", `%${escapeLike(q)}%`);
    if (level) query = query.in("level", level);
    if (category) query = query.in("category_filter.category.slug", category);

    // 3- Sort (+ id as a tie-breaker so pages never repeat or skip a course)
    const { column, ascending } = SORT_COLUMNS[sort];
    query = query
        .order(column, { ascending, nullsFirst: false })
        .order("id", { ascending: true });

    // 4- Paginate
    const from = (page - 1) * pageSize;
    const { data, count, error } = await query.range(from, from + pageSize - 1);

    // Page after the last one (?page=99) → empty page instead of an error
    if (error?.code === "PGRST103") {
        const totalCount = Number(error.details?.match(/only (\d+) rows/)?.[1] ?? 0);
        return { courses: [], page, pageSize, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) };
    }
    if (error) throw error;

    // 5- Flatten course_categories → categories
    const rows = (data ?? []) as unknown as CourseQueryRow[];
    const courses: Course[] = rows.map(({ course_categories, ...course }) => {
        delete (course as Record<string, unknown>).category_filter; // filter-only embed, not part of the response
        return { ...course, categories: course_categories.map((item) => item.category) };
    });

    const totalCount = count ?? 0;
    return {
        courses,
        page,
        pageSize,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    };
};
