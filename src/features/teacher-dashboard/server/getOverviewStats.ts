import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { OverviewStats } from "../types";

/**
 * Server only: the numbers of the logged-in teacher, ready from the database.
 * get_teacher_overview_stats() finds the teacher by himself (auth.uid()) → no teacherId to send.
 * cache() → several cards in the same request share ONE call.
 */
export const getOverviewStats = cache(async (): Promise<OverviewStats> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_teacher_overview_stats");

    if (error) throw error;
    if (!data) throw new Error("Couldn't load the overview stats"); // null = not logged in

    return data as OverviewStats;
});
