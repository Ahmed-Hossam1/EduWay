import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";

type Params = {
    params: Promise<{ notificationId: string }>;
};

// POST /api/notifications/:notificationId/read → this notification becomes read (a click on it in the bell)
export async function POST(_request: NextRequest, { params }: Params) {
    try {
        const { notificationId } = await params;
        if (!z.uuid().safeParse(notificationId).success) {
            return NextResponse.json({ message: "A valid notificationId is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // RLS: he can change only read_at, and only on his own notifications (already read → nothing changes)
        const { error } = await supabase
            .from("notifications")
            .update({ read_at: new Date().toISOString() })
            .eq("id", notificationId)
            .is("read_at", null);

        if (error) throw error;

        return NextResponse.json({ message: "Notification marked as read" }, { status: 200 });
    } catch (error) {
        console.error("Read notification error:", error);
        return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
