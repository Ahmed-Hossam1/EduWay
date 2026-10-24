import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { RecentSale } from "../types";

/**
 * The last 5 paid sales of the logged-in teacher's courses (newest first).
 *
 * Admin client: the orders RLS lets only the BUYER read his order, not the teacher
 * (with the normal client, orders!inner would return nothing).
 * ⚠️ So .eq("course.instructor_id", user.id) IS the security. The teacher id comes from the
 * session here (never from a parameter), so nobody can ask for another teacher's sales.
 */
export async function getTeacherRecentSales(): Promise<RecentSale[]> {
    const user = await getAuthUser(); // cached: the layout asked already → no new request
    const admin = createSupabaseAdminClient();

    const { data, error } = await admin
        .from("order_items")
        // order_items has no id: one row = (order_id + course_id)
        .select(
            `order_id, course_id, price,
             order:orders!inner ( id, status, paid_at, buyer:profiles!orders_user_id_fkey ( first_name, last_name ) ),
             course:courses!inner ( id, title, thumbnail_url, instructor_id )`,
        )
        .eq("course.instructor_id", user.id)
        .eq("order.status", "paid")
        .not("order.paid_at", "is", null)
        // "order(paid_at)" sorts the SALES by the order date
        // ({ referencedTable: "orders" } would only sort the rows inside "order", not the sales)
        .order("order(paid_at)", { ascending: false })
        .limit(5);

    if (error) throw error;

    // price is a numeric column: Supabase already returns it as a number (checked: 24.99, not "24.99")
    return data as unknown as RecentSale[];
}
