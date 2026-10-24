import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryListItem } from "@/features/categories/types";
import { FilterOption } from "../types";

/**
 * Server only: returns the categories for the filters sidebar,
 * with how many PUBLISHED courses are in each one (the same database function as /categories).
 */
export const getCategories = async (): Promise<FilterOption[]> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_categories_with_counts", {
        p_q: null,
        p_hide_empty: false, // the sidebar shows every category
    });

    if (error) throw error;

    // { name, slug, coursesCount }  →  { id: slug, label: name, count }
    return (data as CategoryListItem[]).map((category) => ({
        id: category.slug,
        label: category.name,
        count: category.coursesCount,
    }));
};
