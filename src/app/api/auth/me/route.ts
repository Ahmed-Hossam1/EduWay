import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/requireUser";
import { ProfileSummary } from "@/features/profile/types";

// GET /api/auth/me → the profile of the logged-in user (+ the teacher headline) for the Navbar / menus
export async function GET() {
    try {
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // the database returns it ready: { id, first_name, ..., role, status, headline } (null = no profile row)
        const { data, error } = await supabase.rpc("get_my_profile");

        if (error) throw error;
        if (!data) return NextResponse.json({ message: "Profile not found" }, { status: 404 });

        return NextResponse.json(data as ProfileSummary, { status: 200 });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
