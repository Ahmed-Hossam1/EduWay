import "server-only";
import { getCourses } from "@/features/courses/server/getCourses";
import { Course } from "@/features/courses/types";

/**
 * Server only: the teacher's published courses (most popular first).
 */
export const getInstructorCourses = async (instructorId: string): Promise<Course[]> => {
    // all his courses on one page (a teacher won't have hundreds of courses)
    const { courses } = await getCourses({ instructorId, sort: "popular", page: 1 }, 100);

    return courses;
};
