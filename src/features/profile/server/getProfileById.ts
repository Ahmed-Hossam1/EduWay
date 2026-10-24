import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Profile } from "../types";

/**
 * Server only: one profile by id (API routes / server components, never the browser).
 * Throws when the profile can't be read.
 * cache() → the layout and the page can both call it: the database is asked once per request.
 */
export const getProfileById = cache(async (id: string): Promise<Profile> => {
    const supabase = await createSupabaseServerClient();
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", id).single();
    if (!profile) throw error;
    return profile;
});
