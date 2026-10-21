import "server-only";
import { RecentSale } from "../types";
import { getTeacherCourses } from "./base/getTeacherCourses";
import { getTeacherSales } from "./base/getTeacherSales";

// The last 3 sales of this teacher's courses (newest first)
export async function getRecentSales(teacherId: string): Promise<RecentSale[]> {
    const [courses, sales] = await Promise.all([getTeacherCourses(teacherId), getTeacherSales(teacherId)]);

    // [...sales] = a COPY: sort() changes the array, and cache() shares this same array with the other cards
    return [...sales]
        .sort((a, b) => b.order.paid_at.localeCompare(a.order.paid_at))
        .slice(0, 3)
        .map((sale) => ({
            id: `${sale.order_id}-${sale.course_id}`, // unique: one course in one order
            studentName: `${sale.order.buyer?.first_name ?? ""} ${sale.order.buyer?.last_name ?? ""}`.trim() || "A student",
            courseTitle: courses.find((course) => course.id === sale.course_id)?.title ?? "",
            amount: sale.price, // no refunds in the database yet → always positive
        }));
}
