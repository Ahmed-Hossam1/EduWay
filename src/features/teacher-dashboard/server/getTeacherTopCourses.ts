import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { TopCourse } from "../types";

// The 3 published courses of the logged-in teacher with the most students (the hover fan)
export async function getTeacherTopCourses(): Promise<TopCourse[]> {
    const user = await getAuthUser(); // cached: the layout asked already → no new request
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("courses")
        .select("id, title, slug, thumbnail_url, students_count, price, currency, status")
        .eq("instructor_id", user.id)
        .eq("status", "published")
        .order("students_count", { ascending: false })
        .order("created_at", { ascending: false }) // same students → the newest first
        .limit(3);

    if (error) throw error;

    return data as TopCourse[];
}
