import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { NewStudent } from "../types";

// The last 5 students who joined the logged-in teacher's courses (newest first)
export async function getTeacherNewStudents(): Promise<NewStudent[]> {
    const user = await getAuthUser(); // cached: the layout asked already → no new request
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("enrollments")
        // enrollments has no id: one row = (user_id + course_id)
        .select(
            `user_id, course_id, enrolled_at,
             student:profiles!enrollments_user_id_fkey ( first_name, last_name, avatar_url ),
             course:courses!inner ( id, title, instructor_id )`,
        )
        .eq("course.instructor_id", user.id)
        .order("enrolled_at", { ascending: false })
        .limit(5);

    if (error) throw error;

    // Supabase can't know the shape of the joins → we tell it here
    return data as unknown as NewStudent[];
}
