import "server-only";
import { TopCourse } from "../types";
import { getTeacherCourses } from "./base/getTeacherCourses";
import { getTeacherSales } from "./base/getTeacherSales";

// The 3 best-selling courses (the hover fan)
export async function getTopCourses(teacherId: string): Promise<TopCourse[]> {
    const [courses, sales] = await Promise.all([getTeacherCourses(teacherId), getTeacherSales(teacherId)]);

    // { courseId: total money } → e.g. { "abc": 2180, "def": 1640 }
    const earningsByCourse: Record<string, number> = {};
    for (const sale of sales) {
        earningsByCourse[sale.course_id] = (earningsByCourse[sale.course_id] ?? 0) + sale.price;
    }

    return courses
        .map((course) => ({
            title: course.title,
            slug: course.slug,
            thumbnailUrl: course.thumbnail_url ?? "/images/course-web-dev.jpg",
            students: course.students_count,
            earnings: Math.round((earningsByCourse[course.id] ?? 0) * 100) / 100,
        }))
        .sort((a, b) => b.earnings - a.earnings) // the biggest first
        .slice(0, 3);
}
