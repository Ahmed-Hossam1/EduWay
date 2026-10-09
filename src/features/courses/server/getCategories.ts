import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FilterOption } from "../types";

/**
 * Server only: returns the categories for the filters sidebar,
 * with how many courses are in each one.
 */
export const getCategories = async (): Promise<FilterOption[]> => {
    const supabase = await createSupabaseServerClient();

    // course_categories(count) → Supabase counts the courses of every category for us
    const { data, error } = await supabase
        .from("categories")
        .select("name, slug, course_categories(count)")
        .order("name");

    if (error) throw error;

    // instead of { name, slug, course_categories: [{ count: 3 }] }  →  { id: slug, label: name, count: 3 }
    return data.map((category) => ({
        id: category.slug,
        label: category.name,
        count: category.course_categories[0]?.count ?? 0,
    }));
};
