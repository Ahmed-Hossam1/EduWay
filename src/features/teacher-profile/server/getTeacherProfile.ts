import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/requireUser";
import { InstructorExperience } from "@/features/instructors/data/experienceLevels";

export interface TeacherFullProfile {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    headline: string | null;
    bio: string | null;
    experience_level: InstructorExperience | null;
    skills: string[];
    teaching_languages: string[];
    linkedin_url: string | null;
    website_url: string | null;
    github_url: string | null;
    twitter_url: string | null;
    university: string | null;
    company: string | null;
    certifications: { id: string; name: string; issuer: string | null; year: number | null }[];
}

/**
 * Server-only: fetch the full instructor profile for the currently logged-in teacher.
 * cache() → layout and page can both call it; the database is queried only once per request.
 */
export const getTeacherProfile = cache(async (): Promise<TeacherFullProfile | null> => {
    // requireUser only works in API routes (uses NextResponse). For server components,
    // we use createSupabaseServerClient directly and call getUser ourselves.
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch the base profile row
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url, role, status")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) return null;
    if (profile.role !== "teacher" || profile.status !== "approved") return null;

    // Fetch instructor_profiles row (may not exist yet)
    const { data: instructorProfile } = await supabase
        .from("instructor_profiles")
        .select(
            "headline, bio, experience_level, skills, teaching_languages, linkedin_url, website_url, github_url, twitter_url, university, company",
        )
        .eq("instructor_id", user.id)
        .maybeSingle();

    // Fetch certifications
    const { data: certifications } = await supabase
        .from("instructor_certifications")
        .select("id, name, issuer, year")
        .eq("instructor_id", user.id)
        .order("year", { ascending: false });

    return {
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url,
        headline: instructorProfile?.headline ?? null,
        bio: instructorProfile?.bio ?? null,
        experience_level: (instructorProfile?.experience_level as InstructorExperience | null) ?? null,
        skills: instructorProfile?.skills ?? [],
        teaching_languages: instructorProfile?.teaching_languages ?? [],
        linkedin_url: instructorProfile?.linkedin_url ?? null,
        website_url: instructorProfile?.website_url ?? null,
        github_url: instructorProfile?.github_url ?? null,
        twitter_url: instructorProfile?.twitter_url ?? null,
        university: instructorProfile?.university ?? null,
        company: instructorProfile?.company ?? null,
        certifications: certifications ?? [],
    };
});
