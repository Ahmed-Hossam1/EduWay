import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/requireUser";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { onboardingSchema } from "@/features/auth/onboarding/schemas/onboardingSchema";
import { getProfileById } from "@/features/profile/server/getProfileById";

// POST /api/onboarding  { ...all 3 steps } -> { nextRoute: "/account/waiting" }
// Saves the teacher profile and sends it for review (status: onboarding -> waiting).
// Every submit adds a NEW row in instructor_applications (pending) → the admin keeps the history.
export async function POST(request: NextRequest) {
    try {
        // 1- Check the data again with the SAME schema as the form (never trust the browser)
        const body = await request.json()
        const result = onboardingSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid onboarding data", errors: result.error.flatten().fieldErrors },
                { status: 400 },
            );
        }
        const data = result.data;

        // 2- Logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { user } = auth;

        // 3- Only a teacher who is still in the onboarding can send it (only once)
        const profile = await getProfileById(user.id);

        if (profile.role !== "teacher") {
            return NextResponse.json({ message: "Only teachers can complete the onboarding" }, { status: 403 });
        }
        if (profile.status !== "onboarding") {
            return NextResponse.json({ message: "Your profile was already submitted" }, { status: 409 });
        }

        // 4- Save with the admin client: the teacher must NOT be able to change
        //    his own status (or he could set himself "approved"), so only the server writes here.
        const admin = createSupabaseAdminClient();

        // 4.1- The teacher profile (upsert = create, or update if it exists)
        //      empty optional text "" → null in the database
        const { error: instructorError } = await admin.from("instructor_profiles").upsert({
            profile_id: user.id,
            headline: data.headline,
            bio: data.bio,
            category_id: data.categoryId,
            experience_level: data.experienceLevel,
            skills: data.skills,
            teaching_languages: data.teachingLanguages,
            university: data.university || null,
            company: data.company || null,
            linkedin_url: data.linkedinUrl || null,
            website_url: data.websiteUrl || null,
            github_url: data.githubUrl || null,
            twitter_url: data.twitterUrl || null,
            updated_at: new Date().toISOString(),
        });

        if (instructorError) {
            // 23503 = the category id doesn't exist in the categories table
            if (instructorError.code === "23503") {
                return NextResponse.json({ message: "Choose a valid category" }, { status: 400 });
            }
            throw instructorError;
        }

        // 4.2- The certifications: delete the old ones, then add the new list
        const { error: deleteError } = await admin.from("instructor_certifications").delete().eq("profile_id", user.id);

        if (deleteError) throw deleteError;

        if (data.certifications.length > 0) {
            const { error: certificationsError } = await admin.from("instructor_certifications").insert(
                data.certifications.map((certification) => ({
                    profile_id: user.id,
                    name: certification.name,
                    issuer: certification.issuer || null,
                    year: certification.year ? Number(certification.year) : null, // "2024" → 2024
                })),
            );

            if (certificationsError) throw certificationsError;
        }

        // 4.3- A new application for the admin (first time, or "Apply again" after a rejection)
        const { error: applicationError } = await admin.from("instructor_applications").insert({
            profile_id: user.id, // status = "pending" and submitted_at = now() by default
        });

        if (applicationError) throw applicationError;

        // 4.4- LAST: the name + photo, and status → waiting.
        //      (if anything above failed, he is still "onboarding" and can try again)
        const { error: updateError } = await admin
            .from("profiles")
            .update({
                first_name: data.firstName,
                last_name: data.lastName,
                avatar_url: data.avatarUrl || null,
                status: "waiting",
                updated_at: new Date().toISOString(),
            })
            .eq("id", user.id)
            .eq("status", "onboarding");

        if (updateError) throw updateError;

        return NextResponse.json(
            { message: "Profile submitted for review", nextRoute: "/account/waiting" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Onboarding error:", error);
        return NextResponse.json({ message: "Failed to submit your profile" }, { status: 500 });
    }
}
