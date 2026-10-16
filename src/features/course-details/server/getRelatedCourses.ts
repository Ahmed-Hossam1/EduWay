import "server-only";
import { getCourses } from "@/features/courses/server/getCourses";
import { Course } from "@/features/courses/types";

const RELATED_COURSES_COUNT = 4;

/**
 * Server only: the most popular courses in the same category,
 * without the course we are looking at.
 */
export const getRelatedCourses = async (courseId: string, categorySlug: string | undefined): Promise<Course[]> => {
    if (!categorySlug) return [];

    // ask for one more, because the current course can be in the list
    const { courses } = await getCourses(
        { category: [categorySlug], sort: "popular", page: 1 },
        RELATED_COURSES_COUNT + 1,
    );

    return courses.filter((course) => course.id !== courseId).slice(0, RELATED_COURSES_COUNT);
};
