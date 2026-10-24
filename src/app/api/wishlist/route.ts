import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";

// GET /api/wishlist → { courseIds: ["...", "..."] }  (the logged-in user's saved courses)
export async function GET() {
    try {
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        const { data, error } = await supabase
            .from("wishlist_items")
            .select("course_id")
            .eq("user_id", user.id) // RLS allows only his rows too; this keeps it safe even if a policy changes
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ courseIds: data.map((item) => item.course_id) }, { status: 200 });
    } catch (error) {
        console.error("Get wishlist error:", error);
        return NextResponse.json({ message: "Failed to load wishlist" }, { status: 500 });
    }
}

const addSchema = z.object({ courseId: z.uuid() });

// POST /api/wishlist  { courseId } → adds the course (clicking twice is fine: no duplicate, no error)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null);
        const result = addSchema.safeParse(body);
        if (!result.success) return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        // upsert + ignoreDuplicates = "insert ... on conflict do nothing"
        const { error } = await supabase
            .from("wishlist_items")
            .upsert(
                { user_id: user.id, course_id: result.data.courseId },
                { onConflict: "user_id,course_id", ignoreDuplicates: true },
            );

        if (error) throw error;

        return NextResponse.json({ message: "Added to wishlist" }, { status: 201 });
    } catch (error) {
        console.error("Add to wishlist error:", error);
        return NextResponse.json({ message: "Failed to add to wishlist" }, { status: 500 });
    }
}

// DELETE /api/wishlist → removes every saved course ("Remove all")
export async function DELETE() {
    try {
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        const { error } = await supabase.from("wishlist_items").delete().eq("user_id", user.id);
        if (error) throw error;

        return NextResponse.json({ message: "Removed all from wishlist" }, { status: 200 });
    } catch (error) {
        console.error("Remove all from wishlist error:", error);
        return NextResponse.json({ message: "Failed to remove all from wishlist" }, { status: 500 });
    }
}
