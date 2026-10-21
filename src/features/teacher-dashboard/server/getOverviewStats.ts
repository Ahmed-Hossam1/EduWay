import "server-only";
import { OverviewStats } from "../types";
import { getTeacherCourses } from "./base/getTeacherCourses";
import { getTeacherSales } from "./base/getTeacherSales";
import { getTeacherEnrollments } from "./base/getTeacherEnrollments";
import { daysAgo, startOfMonth } from "../utils/dates";
import { countPerDay, sumPerWeekOfMonth } from "../utils/groupByDate";

/**
 * The 4 cards on top (+ the numbers of the profile card).
 * Math only: the data comes from the 3 cached base queries.
 */
export async function getOverviewStats(teacherId: string): Promise<OverviewStats> {
    // the 3 run at the same time (or come from the cache if another card asked first)
    const [courses, sales, enrollments] = await Promise.all([
        getTeacherCourses(teacherId),
        getTeacherSales(teacherId),
        getTeacherEnrollments(teacherId),
    ]);

    const monthStart = startOfMonth();
    const weekStart = daysAgo(7);

    const salesThisMonth = sales.filter((sale) => new Date(sale.order.paid_at) >= monthStart);
    const enrollmentsThisMonth = enrollments.filter((enrollment) => new Date(enrollment.enrolled_at) >= monthStart);
    const enrollmentsThisWeek = enrollments.filter((enrollment) => new Date(enrollment.enrolled_at) >= weekStart);
    const enrolledDates = enrollments.map((enrollment) => enrollment.enrolled_at);

    return {
        earningsThisMonth: salesThisMonth.reduce((sum, sale) => sum + sale.price, 0),
        earningsByWeek: sumPerWeekOfMonth(salesThisMonth.map((sale) => ({ date: sale.order.paid_at, value: sale.price }))),
        newStudents: enrollmentsThisMonth.length,
        studentsTrend: countPerDay(enrolledDates, 14),
        publishedCourses: courses.filter((course) => course.status === "published").length,
        draftCourses: courses.filter((course) => course.status === "draft").length,
        totalStudents: courses.reduce((sum, course) => sum + course.students_count, 0),
        enrollmentsThisWeek: enrollmentsThisWeek.length,
        enrollmentsTrend: countPerDay(enrolledDates, 7),
    };
}
