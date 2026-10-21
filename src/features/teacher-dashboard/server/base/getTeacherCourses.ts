import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type TeacherCourseRow = {
    id: string;
    title: string;
    slug: string;
    status: "draft" | "published" | "archived";
    thumbnail_url: string | null;
    students_count: number;
};

/**
 * Server only: ALL the courses of this teacher (drafts too: the RLS lets an owner see his own).
 * cache() → if several cards ask for it in the SAME request, the database is asked only once.
 */
export const getTeacherCourses = cache(async (teacherId: string): Promise<TeacherCourseRow[]> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("courses")
        .select("id, title, slug, status, thumbnail_url, students_count")
        .eq("instructor_id", teacherId);

    if (error) throw error;

    return data as TeacherCourseRow[];
});
