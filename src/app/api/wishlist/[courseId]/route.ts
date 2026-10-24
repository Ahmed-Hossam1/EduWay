import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";

type Params = {
    params: Promise<{ courseId: string }>;
};

// DELETE /api/wishlist/:courseId → removes the course from the logged-in user's wishlist
export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { courseId } = await params;
        if (!z.uuid().safeParse(courseId).success) {
            return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        const { error } = await supabase
            .from("wishlist_items")
            .delete()
            .eq("user_id", user.id)
            .eq("course_id", courseId);
        if (error) throw error;

        return NextResponse.json({ message: "Removed from wishlist" }, { status: 200 });
    } catch (error) {
        console.error("Remove from wishlist error:", error);
        return NextResponse.json({ message: "Failed to remove from wishlist" }, { status: 500 });
    }
}
