import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// What we saved the last time he sent the onboarding (instructor_profiles + certifications)
export type SavedOnboardingAnswers = {
    instructor: {
        headline: string | null;
        bio: string | null;
        category_id: string | null;
        experience_level: string | null;
        skills: string[] | null;
        teaching_languages: string[] | null;
        university: string | null;
        company: string | null;
        linkedin_url: string | null;
        website_url: string | null;
        github_url: string | null;
        twitter_url: string | null;
    } | null; // null = he never sent the onboarding
    certifications: { name: string; issuer: string | null; year: number | null }[];
};

/**
 * Server only: his old onboarding answers, so "Apply again" opens the form already filled
 * (he only fixes what the admin asked for, he doesn't type everything again).
 * RLS lets a teacher read his own instructor profile + certifications.
 */
export const getSavedOnboardingAnswers = async (userId: string): Promise<SavedOnboardingAnswers> => {
    const supabase = await createSupabaseServerClient();

    const { data: instructor, error: instructorError } = await supabase
        .from("instructor_profiles")
        .select(
            "headline, bio, category_id, experience_level, skills, teaching_languages, university, company, linkedin_url, website_url, github_url, twitter_url",
        )
        .eq("profile_id", userId)
        .maybeSingle();

    if (instructorError) throw instructorError;

    const { data: certifications, error: certificationsError } = await supabase
        .from("instructor_certifications")
        .select("name, issuer, year")
        .eq("profile_id", userId);

    if (certificationsError) throw certificationsError;

    return {
        instructor,
        certifications: certifications ?? [],
    };
};
