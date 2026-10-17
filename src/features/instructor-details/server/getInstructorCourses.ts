import "server-only";
import { getCourses } from "@/features/courses/server/getCourses";
import { Course } from "@/features/courses/types";
import { InstructorStats } from "../types";
import { computeInstructorStats } from "../utils/format";

type InstructorCourses = {
    courses: Course[];
    stats: InstructorStats;
};

/**
 * Server only: the teacher's published courses + numbers computed from them
 * (courses count, total students, average rating).
 */
export const getInstructorCourses = async (instructorId: string): Promise<InstructorCourses> => {
    // all his courses on one page (a teacher won't have hundreds of courses)
    const { courses } = await getCourses({ instructorId, sort: "popular", page: 1 }, 100);

    return {
        courses,
        stats: computeInstructorStats(courses),
    };
};
