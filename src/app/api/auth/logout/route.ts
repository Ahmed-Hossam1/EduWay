import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// POST /api/auth/logout → ends the session (the server removes the Supabase cookies)
// Same path as every other auth action: the browser talks to our API, the API talks to Supabase.
export async function POST() {
    try {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        return NextResponse.json({ message: "Logged out" }, { status: 200 });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ message: "Couldn't log out. Please try again." }, { status: 500 });
    }
}
