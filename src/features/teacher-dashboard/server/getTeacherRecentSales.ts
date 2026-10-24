import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { RecentSale } from "../types";

/**
 * The last 5 paid sales of this teacher's courses (newest first).
 *
 * Admin client: the orders RLS lets only the BUYER read his order, not the teacher
 * (with the normal client, orders!inner would return nothing).
 * ⚠️ So .eq("course.instructor_id", teacherId) IS the security: he only gets the sales of HIS courses.
 */
export async function getTeacherRecentSales(teacherId: string): Promise<RecentSale[]> {
    const admin = createSupabaseAdminClient();

    const { data, error } = await admin
        .from("order_items")
        // order_items has no id: one row = (order_id + course_id)
        .select(
            `order_id, course_id, price,
             order:orders!inner ( id, status, paid_at, buyer:profiles!orders_user_id_fkey ( first_name, last_name ) ),
             course:courses!inner ( id, title, thumbnail_url, instructor_id )`,
        )
        .eq("course.instructor_id", teacherId)
        .eq("order.status", "paid")
        .not("order.paid_at", "is", null)
        // "order(paid_at)" sorts the SALES by the order date
        // ({ referencedTable: "orders" } would only sort the rows inside "order", not the sales)
        .order("order(paid_at)", { ascending: false })
        .limit(5);

    if (error) {
        throw new Error(`Failed to fetch recent sales: ${error.message}`);
    }

    // the price comes as a string from numeric columns sometimes → always a number
    return (data as unknown as RecentSale[]).map((sale) => ({ ...sale, price: Number(sale.price) }));
}
