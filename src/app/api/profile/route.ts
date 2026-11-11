import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/requireUser";
import { teacherProfileSchema } from "@/features/teacher-profile/schemas/teacherProfileSchema";

// PATCH /api/profile  → update the logged-in teacher's profile
export async function PATCH(request: NextRequest) {
    try {
        // 1 – Validate body
        const body = await request.json();
        const result = teacherProfileSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid profile data", errors: result.error.flatten().fieldErrors },
                { status: 400 },
            );
        }
        const values = result.data;

        // 2 – Auth
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        // 3 – Check the user is an approved teacher
        const { data: profile } = await supabase
            .from("profiles")
            .select("role, status")
            .eq("id", user.id)
            .single();

        if (!profile || profile.role !== "teacher" || profile.status !== "approved") {
            return NextResponse.json(
                { message: "Only approved teachers can update their instructor profile" },
                { status: 403 },
            );
        }

        // 4a – Update profiles table
        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                first_name: values.firstName,
                last_name: values.lastName,
                avatar_url: values.avatarUrl,
            })
            .eq("id", user.id);

        if (profileError) throw profileError;

        // 4b – Upsert instructor_profiles
        const { error: instructorProfileError } = await supabase.from("instructor_profiles").upsert(
            {
                instructor_id: user.id,
                headline: values.headline,
                bio: values.bio,
                experience_level: values.experienceLevel,
                skills: values.skills,
                teaching_languages: values.teachingLanguages,
                linkedin_url: values.linkedinUrl ?? null,
                website_url: values.websiteUrl ?? null,
                github_url: values.githubUrl ?? null,
                twitter_url: values.twitterUrl ?? null,
                university: values.university ?? null,
                company: values.company ?? null,
            },
            { onConflict: "instructor_id" },
        );

        if (instructorProfileError) throw instructorProfileError;

        // 4c – Replace certifications: delete existing, then insert new ones
        const { error: deleteError } = await supabase
            .from("instructor_certifications")
            .delete()
            .eq("instructor_id", user.id);

        if (deleteError) throw deleteError;

        if (values.certifications.length > 0) {
            const certRows = values.certifications.map((cert) => ({
                instructor_id: user.id,
                name: cert.name,
                issuer: cert.issuer || null,
                year: cert.year ? Number(cert.year) : null,
            }));

            const { error: insertError } = await supabase.from("instructor_certifications").insert(certRows);

            if (insertError) throw insertError;
        }

        return NextResponse.json({ message: "Profile saved" }, { status: 200 });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
    }
}
