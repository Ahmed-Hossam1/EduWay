import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/requireUser";

// POST /api/onboarding/reapply → { nextRoute: "/account/onboarding" }
// A rejected teacher wants to try again: status rejected → onboarding.
// His old answers stay saved, so the onboarding form opens already filled.
export async function POST() {
    try {
        // 1- Logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // 2- Back to the onboarding: the database allows it only for a REJECTED teacher (false = not allowed)
        const { data: reapplied, error } = await supabase.rpc("reapply_as_teacher");

        if (error) throw error;

        if (!reapplied) {
            return NextResponse.json({ message: "You can't apply again right now" }, { status: 403 });
        }

        return NextResponse.json({ nextRoute: "/account/onboarding" }, { status: 200 });
    } catch (error) {
        console.error("Reapply error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
