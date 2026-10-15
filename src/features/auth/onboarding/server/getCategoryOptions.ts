import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryOption } from "../types";

/**
 * Server only: the categories for step 2 (id = the uuid we save in instructor_profiles.category_id).
 * They come from the database, so they are always the same as the courses categories.
 */
export const getCategoryOptions = async (): Promise<CategoryOption[]> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");

    if (error) throw error;

    return data;
};
