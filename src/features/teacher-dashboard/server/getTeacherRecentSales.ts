import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { RecentSale } from "../types";

/**
 * Server only: the last 5 paid sales of the logged-in teacher's courses (newest first).
 * get_teacher_recent_sales() finds the teacher by himself (auth.uid()) → no teacherId to send,
 * so nobody can ask for another teacher's sales. (The orders RLS hides the orders from the teacher,
 * the database function is allowed to read them for HIS courses only → no admin client here.)
 */
export async function getTeacherRecentSales(): Promise<RecentSale[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_teacher_recent_sales");

    if (error) throw error;
    return data as RecentSale[];
}
