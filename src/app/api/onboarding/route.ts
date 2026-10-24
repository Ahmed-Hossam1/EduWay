import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/requireUser";
import { onboardingSchema } from "@/features/auth/onboarding/schemas/onboardingSchema";

// POST /api/onboarding  { ...all 3 steps } -> { nextRoute: "/account/waiting" }
// Saves the teacher profile and sends it for review (status: onboarding -> waiting).
// Every submit adds a NEW row in instructor_applications (pending) → the admin keeps the history.
export async function POST(request: NextRequest) {
    try {
        // 1- Check the data again with the SAME schema as the form (never trust the browser)
        const body = await request.json().catch(() => null);
        const result = onboardingSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid onboarding data", errors: result.error.flatten().fieldErrors },
                { status: 400 },
            );
        }

        // 2- Logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // 3- The database saves everything in ONE step (all or nothing):
        //    teacher profile + certifications + a new application + name / photo + status → waiting.
        //    It checks by itself that he is a teacher still in the onboarding.
        const { error } = await supabase.rpc("submit_onboarding", { p_data: result.data });

        if (error) {
            if (error.message === "NOT_A_TEACHER") {
                return NextResponse.json({ message: "Only teachers can complete the onboarding" }, { status: 403 });
            }
            if (error.message === "ALREADY_SUBMITTED") {
                return NextResponse.json({ message: "Your profile was already submitted" }, { status: 409 });
            }
            // 23503 = the category id doesn't exist in the categories table
            if (error.code === "23503") {
                return NextResponse.json({ message: "Choose a valid category" }, { status: 400 });
            }
            throw error;
        }

        return NextResponse.json(
            { message: "Profile submitted for review", nextRoute: "/account/waiting" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Onboarding error:", error);
        return NextResponse.json({ message: "Failed to submit your profile" }, { status: 500 });
    }
}
