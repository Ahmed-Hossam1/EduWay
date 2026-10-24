import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NewStudent } from "../types";

// The last 5 students who joined this teacher's courses (newest first)
export async function getTeacherNewStudents(teacherId: string): Promise<NewStudent[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("enrollments")
        // enrollments has no id: one row = (user_id + course_id)
        .select(
            `user_id, course_id, enrolled_at,
             student:profiles!enrollments_user_id_fkey ( first_name, last_name, avatar_url ),
             course:courses!inner ( id, title, instructor_id )`,
        )
        .eq("course.instructor_id", teacherId)
        .order("enrolled_at", { ascending: false })
        .limit(5);

    if (error) {
        throw new Error(`Failed to fetch new students: ${error.message}`);
    }

    return data as unknown as NewStudent[];
}
