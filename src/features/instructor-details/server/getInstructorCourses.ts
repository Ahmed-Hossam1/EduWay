import "server-only";
import { getCourses } from "@/features/courses/server/getCourses";
import { Course } from "@/features/courses/types";
import { InstructorStats } from "../types";

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

    // get total number of students and ratings from all courses
    const studentsCount = courses.reduce((total, course) => total + course.students_count, 0);
    const ratingsCount = courses.reduce((total, course) => total + course.rating_count, 0);

    // weighted average: a course with 2,000 ratings counts more than one with 10
    const ratingsSum = courses.reduce((total, course) => total + course.rating_avg * course.rating_count, 0);
    const averageRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0;

    return {
        courses,
        stats: {
            coursesCount: courses.length,
            studentsCount,
            averageRating,
            ratingsCount,
        },
    };
};
