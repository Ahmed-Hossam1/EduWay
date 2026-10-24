import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GetInstructorsParams, InstructorListItem } from "../types";

/**
 * Server only: all approved teachers with their stats, after search and sort.
 * Used by the /instructors page.
 *
 * The database does the work (get_instructors): the numbers of each teacher (from his published courses),
 * the search and the sort → we get the ready list.
 */
export const getInstructors = async (params: GetInstructorsParams): Promise<InstructorListItem[]> => {
    const { q, sort = "students" } = params;

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_instructors", {
        p_q: q ?? null,
        p_sort: sort,
    });

    if (error) throw error;

    return data as InstructorListItem[];
};
