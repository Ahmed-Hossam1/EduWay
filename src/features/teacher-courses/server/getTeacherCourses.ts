import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TEACHER_COURSES_PAGE_SIZE, TeacherCoursesQuery } from "../schemas/teacherCoursesQuerySchema";
import { TeacherCourse, TeacherCoursesResponse } from "../types";

// What get_teacher_courses() returns (database function): one page + how many courses match in total
type TeacherCoursesResult = {
    courses: TeacherCourse[];
    totalCount: number;
};

/**
 * Server only: one page of the logged-in teacher's courses (drafts too) after status, search and sort.
 *
 * The database does the work (get_teacher_courses): the earnings + new students of each course,
 * the filters, the sort and the page. It finds the teacher by himself (auth.uid()) → no teacherId to send.
 */
export async function getTeacherCourses(query: TeacherCoursesQuery): Promise<TeacherCoursesResponse> {
    const { status, q, sort, page } = query;

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_teacher_courses", {
        p_status: status,
        p_q: q ?? null,
        p_sort: sort,
        p_page: page,
        p_page_size: TEACHER_COURSES_PAGE_SIZE,
    });

    if (error) throw error;
    if (!data) throw new Error("Couldn't load your courses"); // null = not logged in

    const { courses, totalCount } = data as TeacherCoursesResult;

    return { courses, totalCount, pageSize: TEACHER_COURSES_PAGE_SIZE };
}
