import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NewStudent } from "../types";

/**
 * Server only: the last 5 students who joined the logged-in teacher's courses (newest first).
 * get_teacher_new_students() finds the teacher by himself (auth.uid()) → no teacherId to send.
 */
export async function getTeacherNewStudents(): Promise<NewStudent[]> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_teacher_new_students");

    if (error) throw error;
    return data as NewStudent[];
}
