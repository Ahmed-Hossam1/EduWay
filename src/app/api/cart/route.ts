import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isCourseOwner } from "@/lib/authorization/ownership";
import { requireUser } from "@/lib/supabase/requireUser";

// GET /api/cart → { courseIds: ["...", "..."] }  (the logged-in user's cart)
export async function GET() {
    try {
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        const { data, error } = await supabase
            .from("cart_items")
            .select("course_id")
            .eq("user_id", user.id) // RLS allows only his rows too; this keeps it safe even if a policy changes
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ courseIds: data.map((item) => item.course_id) }, { status: 200 });
    } catch (error) {
        console.error("Get cart error:", error);
        return NextResponse.json({ message: "Failed to load cart" }, { status: 500 });
    }
}

const addSchema = z.object({ courseId: z.uuid() });

// POST /api/cart  { courseId } → adds the course to the cart (the database also removes it from the wishlist)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = addSchema.safeParse(body);
        if (!result.success) return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        const { courseId } = result.data;

        // 0- a teacher can't buy his own course → don't let it into the cart at all
        const { data: course } = await supabase.from("courses").select("instructor_id").eq("id", courseId).single();
        if (course && isCourseOwner(user.id, course)) {
            return NextResponse.json({ message: "You can't buy your own course" }, { status: 403 });
        }

        // 1- add to the cart (double click → no duplicate, no error)
        //    RLS refuses free / unpublished / already owned courses.
        //    A database trigger removes it from his wishlist at the same time.
        const { error: cartError } = await supabase
            .from("cart_items")
            .upsert({ user_id: user.id, course_id: courseId }, { onConflict: "user_id,course_id", ignoreDuplicates: true });

        if (cartError) {
            console.error("Add to cart error:", cartError);
            return NextResponse.json({ message: "This course can't be added to the cart" }, { status: 400 });
        }

        return NextResponse.json({ message: "Added to cart" }, { status: 201 });
    } catch (error) {
        console.error("Add to cart error:", error);
        return NextResponse.json({ message: "Couldn't add to cart" }, { status: 500 });
    }
}

// DELETE /api/cart → removes every course from the cart ("Remove all")
export async function DELETE() {
    try {
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id);
        if (error) throw error;

        return NextResponse.json({ message: "Removed all from cart" }, { status: 200 });
    } catch (error) {
        console.error("Remove all from cart error:", error);
        return NextResponse.json({ message: "Failed to remove all from cart" }, { status: 500 });
    }
}
