import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryListItem } from "../types";

/**
 * Server only: the categories for the /categories page.
 *   - counts only the PUBLISHED courses of every category (drafts are hidden from students)
 *   - hides the categories that have no published course
 *   - q = the search text from the URL (?q=design) → only the categories whose name has it
 *
 * The database does the counting and the search (get_categories_with_counts).
 */
export const getCategoriesWithCounts = async (q?: string): Promise<CategoryListItem[]> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_categories_with_counts", {
        p_q: q ?? null,
        p_hide_empty: true, // a category without courses leads to an empty page → don't show it
    });

    if (error) throw error;

    return data as CategoryListItem[];
};
