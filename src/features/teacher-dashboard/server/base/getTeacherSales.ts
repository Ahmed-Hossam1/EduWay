import "server-only";
import { cache } from "react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getTeacherCourses } from "./getTeacherCourses";

// One sale = one course in one PAID order
export type TeacherSaleRow = {
    order_id: string; // order_items has no id: one row = (order_id + course_id)
    price: number;
    course_id: string;
    order: {
        status: string;
        paid_at: string;
        buyer: { first_name: string | null; last_name: string | null } | null;
    };
};

/**
 * Server only: every PAID sale of this teacher's courses.
 *
 * Admin client: the orders RLS lets only the BUYER read his order, not the teacher.
 * ⚠️ So the filter .in("course_id", courseIds) IS the security: he only gets the money of HIS courses.
 */
export const getTeacherSales = cache(async (teacherId: string): Promise<TeacherSaleRow[]> => {
    const courses = await getTeacherCourses(teacherId);
    const courseIds = courses.map((course) => course.id);
    if (courseIds.length === 0) return []; // no courses → no sales (and .in() with [] is not allowed)

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
        .from("order_items")
        .select(
            `order_id, price, course_id,
             order:orders!inner ( status, paid_at, buyer:profiles!orders_user_id_fkey ( first_name, last_name ) )`,
        )
        .in("course_id", courseIds)
        .eq("order.status", "paid"); // !inner → only the items whose order is paid

    if (error) throw error;

    // the price comes as a string from numeric columns sometimes → always a number
    return (data as unknown as TeacherSaleRow[]).map((sale) => ({ ...sale, price: Number(sale.price) }));
});
