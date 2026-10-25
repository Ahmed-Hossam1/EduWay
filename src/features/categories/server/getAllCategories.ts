import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryRow } from "../types";

/**
 * Server only: every category, A to Z (for the forms: onboarding step 2, create / edit course).
 * id = the uuid saved in the database (instructor_profiles.category_id, course_categories.category_id).
 */
export const getAllCategories = async (): Promise<CategoryRow[]> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.from("categories").select("id, name, slug").order("name");

    if (error) throw error;

    return data;
};
