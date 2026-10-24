import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";

type Params = {
    params: Promise<{ courseId: string }>;
};

// DELETE /api/cart/:courseId → removes the course from the logged-in user's cart
export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { courseId } = await params;
        if (!z.uuid().safeParse(courseId).success) {
            return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id).eq("course_id", courseId);
        if (error) throw error;

        return NextResponse.json({ message: "Removed from cart" }, { status: 200 });
    } catch (error) {
        console.error("Remove from cart error:", error);
        return NextResponse.json({ message: "Failed to remove from cart" }, { status: 500 });
    }
}
