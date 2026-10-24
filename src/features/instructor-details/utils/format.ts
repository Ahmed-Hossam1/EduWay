import { formatCompactNumber } from "@/features/courses/utils/format";
import { InstructorStats } from "../types";

// Only the course numbers we need for the stats
type CourseNumbers = {
    students_count: number;
    rating_avg: number;
    rating_count: number;
};

/**
 * The teacher's numbers computed from his published courses (the instructor page).
 * The /instructors list gets the same numbers from the database (get_instructors) —
 * keep this formula the SAME as the SQL there: SUM of students / ratings + weighted average.
 */
export const computeInstructorStats = (courses: CourseNumbers[]): InstructorStats => {
    // get total number of students and ratings from all courses
    const studentsCount = courses.reduce((total, course) => total + course.students_count, 0);
    const ratingsCount = courses.reduce((total, course) => total + course.rating_count, 0);

    // weighted average: a course with 2,000 ratings counts more than one with 10
    const ratingsSum = courses.reduce((total, course) => total + course.rating_avg * course.rating_count, 0);
    const averageRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0;

    return {
        coursesCount: courses.length,
        studentsCount,
        averageRating,
        ratingsCount,
    };
};

/**
 * The stats as the UI shows them (the instructor card AND the instructor page use it).
 *   { coursesCount: 3, studentsCount: 12400, averageRating: 4.73, ratingsCount: 210 }
 *   → { courses: "3", students: "12.4K", rating: "4.7", ratings: "210" }
 * No ratings yet → rating "—".
 */
export const formatInstructorStats = (stats: InstructorStats) => ({
    courses: String(stats.coursesCount),
    students: formatCompactNumber(stats.studentsCount),
    rating: stats.ratingsCount > 0 ? stats.averageRating.toFixed(1) : "—",
    ratings: formatCompactNumber(stats.ratingsCount),
});
