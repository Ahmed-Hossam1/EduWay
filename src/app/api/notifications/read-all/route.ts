import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/requireUser";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// POST /api/notifications/read-all → every unread notification of the user becomes read
export async function POST() {
    try {
        // 1- Logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { user } = auth;

        // 2- Admin client (there is no update policy), but ONLY his rows: .eq("user_id", user.id)
        const admin = createSupabaseAdminClient();
        const { error } = await admin
            .from("notifications")
            .update({ read_at: new Date().toISOString() })
            .eq("user_id", user.id)
            .is("read_at", null);

        if (error) throw error;

        return NextResponse.json({ message: "All notifications marked as read" }, { status: 200 });
    } catch (error) {
        console.error("Read all notifications error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
