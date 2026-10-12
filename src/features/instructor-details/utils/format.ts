import { InstructorExperience, InstructorStats } from "../types";

// enum value → what the user sees (same text as the onboarding "Experience" step)
export const EXPERIENCE_LABELS: Record<InstructorExperience, string> = {
    beginner: "1–2 years of experience",
    intermediate: "3–5 years of experience",
    expert: "5–10 years of experience",
    veteran: "10+ years of experience",
};

// Only the course numbers we need for the stats
type CourseNumbers = {
    students_count: number;
    rating_avg: number;
    rating_count: number;
};

/**
 * The teacher's numbers computed from his published courses.
 * Used by the instructor page and the instructors list.
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
