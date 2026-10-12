import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// GET /api/cart → { courseIds: ["...", "..."] }  (the logged-in user's cart)
export async function GET() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
        .from("cart_items")
        .select("course_id")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Get cart error:", error);
        return NextResponse.json({ message: "Failed to load cart" }, { status: 500 });
    }

    return NextResponse.json({ courseIds: data.map((item) => item.course_id) }, { status: 200 });
}

const addSchema = z.object({ courseId: z.uuid() });

// POST /api/cart  { courseId } → adds the course to the cart AND removes it from the wishlist
export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const result = addSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { courseId } = result.data;

    // 1- add to the cart (double click → no duplicate, no error)
    //    RLS refuses free / unpublished courses
    const { error: cartError } = await supabase
        .from("cart_items")
        .upsert({ user_id: user.id, course_id: courseId }, { onConflict: "user_id,course_id", ignoreDuplicates: true });

    if (cartError) {
        console.error("Add to cart error:", cartError);
        return NextResponse.json({ message: "This course can't be added to the cart" }, { status: 400 });
    }

    // 2- it's in the cart now → it doesn't need to stay in the wishlist
    //    (if this fails the cart is still fine, so we only log it)
    const { error: wishlistError } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("course_id", courseId);

    if (wishlistError) console.error("Remove from wishlist after add to cart error:", wishlistError);

    return NextResponse.json({ message: "Added to cart" }, { status: 201 });
}
