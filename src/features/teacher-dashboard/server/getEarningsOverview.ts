import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EarningsOverview } from "../types";

/**
 * Server only: the earnings of the logged-in teacher, ready from the database
 * (the last 6 months, total revenue, change vs last month, completion rate).
 * get_teacher_earnings_overview() finds the teacher by himself (auth.uid()) → no teacherId to send.
 */
export const getEarningsOverview = cache(async (): Promise<EarningsOverview> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.rpc("get_teacher_earnings_overview");

    if (error) throw error;
    if (!data) throw new Error("Couldn't load the earnings overview"); // null = not logged in

    return data as EarningsOverview;
});
