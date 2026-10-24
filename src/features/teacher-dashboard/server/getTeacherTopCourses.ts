import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TopCourse } from "../types";

// The 3 published courses with the most students (the hover fan)
export async function getTeacherTopCourses(teacherId: string): Promise<TopCourse[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("courses")
        .select("id, title, slug, thumbnail_url, students_count, price, currency, status")
        .eq("instructor_id", teacherId)
        .eq("status", "published")
        .order("students_count", { ascending: false })
        .order("created_at", { ascending: false }) // same students → the newest first
        .limit(3);

    if (error) {
        throw new Error(`Failed to fetch top courses: ${error.message}`);
    }

    return data as TopCourse[];
}
