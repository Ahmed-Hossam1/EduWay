import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PrerequisiteOption } from "../types";

/**
 * Server only: the published courses a teacher can choose as "finish this course first"
 * (every published course except the one he is editing), A to Z.
 */
export const getPrerequisiteOptions = async (courseId: string): Promise<PrerequisiteOption[]> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("courses")
        .select("id, title")
        .eq("status", "published")
        .neq("id", courseId)
        .order("title");

    if (error) throw error;
    return data;
};
