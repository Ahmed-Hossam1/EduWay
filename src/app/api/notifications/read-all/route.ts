import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/requireUser";

// POST /api/notifications/read-all → every unread notification of the user becomes read
export async function POST() {
    try {
        // 1- Logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        // 2- RLS: he can change only read_at, and only on his own notifications
        const { error } = await supabase
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
