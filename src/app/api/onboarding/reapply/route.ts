import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// POST /api/onboarding/reapply → { nextRoute: "/account/onboarding" }
// A rejected teacher wants to try again: status rejected → onboarding.
// His old answers stay saved, so the onboarding form opens already filled.
export async function POST() {
    try {
        // 1- Logged in?
        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // 2- Only a REJECTED teacher can apply again
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, status")
            .eq("id", user.id)
            .single();

        if (profileError) throw profileError;

        if (profile.role !== "teacher" || profile.status !== "rejected") {
            return NextResponse.json({ message: "You can't apply again right now" }, { status: 403 });
        }

        // 3- Back to the onboarding (admin client: a user must never change his own status)
        const admin = createSupabaseAdminClient();
        const { error: updateError } = await admin
            .from("profiles")
            .update({ status: "onboarding", updated_at: new Date().toISOString() })
            .eq("id", user.id)
            .eq("status", "rejected");

        if (updateError) throw updateError;

        return NextResponse.json({ nextRoute: "/account/onboarding" }, { status: 200 });
    } catch (error) {
        console.error("Reapply error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
