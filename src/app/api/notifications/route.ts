import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/requireUser";

// GET /api/notifications → the latest 10 notifications + how many are unread (the bell in the site navbar)
export async function GET() {
    try {
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // the database returns them ready: newest first, with the UI names (readAt, createdAt)
        const { data, error } = await supabase.rpc("get_my_notifications");

        if (error) throw error;

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Get notifications error:", error);
        return NextResponse.json({ message: "Failed to load your notifications" }, { status: 500 });
    }
}
