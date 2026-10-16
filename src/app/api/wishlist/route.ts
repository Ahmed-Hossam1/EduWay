import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// GET /api/wishlist → { courseIds: ["...", "..."] }  (the logged-in user's saved courses)
export async function GET() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
        .from("wishlist_items")
        .select("course_id")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Get wishlist error:", error);
        return NextResponse.json({ message: "Failed to load wishlist" }, { status: 500 });
    }

    return NextResponse.json({ courseIds: data.map((item) => item.course_id) }, { status: 200 });
}

const addSchema = z.object({ courseId: z.uuid() });

// POST /api/wishlist  { courseId } → adds the course (clicking twice is fine: no duplicate, no error)
export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const result = addSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });

    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // upsert + ignoreDuplicates = "insert ... on conflict do nothing"
    const { error } = await supabase
        .from("wishlist_items")
        .upsert(
            { user_id: user.id, course_id: result.data.courseId },
            { onConflict: "user_id,course_id", ignoreDuplicates: true },
        );

    if (error) {
        console.error("Add to wishlist error:", error);
        return NextResponse.json({ message: "Failed to add to wishlist" }, { status: 500 });
    }

    return NextResponse.json({ message: "Added to wishlist" }, { status: 201 });
}

// REMOVE ALL
export async function DELETE() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { error } = await supabase.from("wishlist_items").delete().eq("user_id", user.id);

    if (error) {
        console.error("Remove all from wishlist error:", error);
        return NextResponse.json({ message: "Failed to remove all from wishlist" }, { status: 500 });
    }

    return NextResponse.json({ message: "Removed all from wishlist" }, { status: 200 });
}
