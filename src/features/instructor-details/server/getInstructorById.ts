import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Instructor } from "../types";

/**
 * Server only: one teacher with his instructor profile and certifications.
 * Returns null when the id is not a teacher => the page shows 404.
 *
 * cache() => generateMetadata and the page share one database call.
 */
export const getInstructorById = cache(async (id: string): Promise<Instructor | null> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("profiles")
        .select(
            `
            id, first_name, last_name, avatar_url,
            profile:instructor_profiles (
                headline, bio, experience_level, skills, teaching_languages,
                linkedin_url, website_url, github_url, twitter_url,
                certifications:instructor_certifications ( id, name, issuer, year )
            )
        `,
        )
        .eq("id", id)
        .eq("role", "teacher")
        .order("year", { referencedTable: "profile.certifications", ascending: false })
        .maybeSingle();

    if (error) throw error;

    return data as Instructor | null;
});
