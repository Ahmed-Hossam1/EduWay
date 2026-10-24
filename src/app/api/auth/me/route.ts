import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/requireUser";

// GET /api/auth/me → the profile of the logged-in user (+ the teacher headline) for the Navbar / menus
export async function GET() {
    try {
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        const { data: profile } = await supabase
            .from("profiles")
            // + the teacher headline (instructor_profiles: one row per teacher, none for a student)
            .select("id, first_name, last_name, avatar_url, role, status, instructor_profiles ( headline )")
            .eq("id", user.id)
            .single();

        if (!profile) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

        // { ..., instructor_profiles: { headline } } → { ..., headline } (null for a student)
        const { instructor_profiles, ...rest } = profile;
        const instructor = Array.isArray(instructor_profiles) ? instructor_profiles[0] : instructor_profiles;

        return NextResponse.json({ ...rest, headline: instructor?.headline ?? null }, { status: 200 });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
