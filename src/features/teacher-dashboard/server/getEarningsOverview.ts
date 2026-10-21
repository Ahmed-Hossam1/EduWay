import "server-only";
import { EarningsOverview } from "../types";
import { getTeacherSales } from "./base/getTeacherSales";
import { getTeacherEnrollments } from "./base/getTeacherEnrollments";
import { sumPerMonth } from "../utils/groupByDate";
import { percentChange } from "../utils/percentChange";

// The chart: earnings of the last 6 months + total revenue + completion rate
export async function getEarningsOverview(teacherId: string): Promise<EarningsOverview> {
    const [sales, enrollments] = await Promise.all([getTeacherSales(teacherId), getTeacherEnrollments(teacherId)]);

    const months = sumPerMonth(
        sales.map((sale) => ({ date: sale.order.paid_at, value: sale.price })),
        6,
    );
    const thisMonth = months[months.length - 1].value;
    const lastMonth = months[months.length - 2].value;

    // completed = the student finished the course (completed_at has a date)
    const completed = enrollments.filter((enrollment) => enrollment.completed_at !== null).length;
    const completionRate = enrollments.length === 0 ? 0 : Math.round((completed / enrollments.length) * 1000) / 10;

    return {
        months,
        totalRevenue: Math.round(sales.reduce((sum, sale) => sum + sale.price, 0) * 100) / 100,
        revenueChange: percentChange(thisMonth, lastMonth),
        completionRate,
        completionChange: 0, // TODO: needs the completion rate of last month (when the lesson player exists)
    };
}
