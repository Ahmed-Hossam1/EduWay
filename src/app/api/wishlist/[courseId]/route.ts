import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = {
    params: Promise<{ courseId: string }>;
};

// DELETE /api/wishlist/:courseId → removes the course from the logged-in user's wishlist
export async function DELETE(_request: Request, { params }: Params) {
    const { courseId } = await params;
    if (!z.uuid().safeParse(courseId).success) {
        return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { error } = await supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("course_id", courseId);

    if (error) {
        console.error("Remove from wishlist error:", error);
        return NextResponse.json({ message: "Failed to remove from wishlist" }, { status: 500 });
    }

    return NextResponse.json({ message: "Removed from wishlist" }, { status: 200 });
}
