import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";
import { coursePricingSchema } from "@/features/course-builder/schemas/coursePricingSchema";

type Params = {
    params: Promise<{ courseId: string }>;
};

// PATCH /api/courses/:courseId/pricing  { price, currency } → saves the Pricing tab (price 0 = free)
export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const { courseId } = await params;
        if (!z.uuid().safeParse(courseId).success) {
            return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });
        }

        // 1- Check the data with the SAME schema as the form
        const body = await request.json().catch(() => null);
        const result = coursePricingSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid price", errors: result.error.flatten().fieldErrors },
                { status: 400 },
            );
        }

        // 2- Logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // 3- A plain update: RLS lets a teacher change only HIS course, and only these columns
        const { data: updated, error } = await supabase
            .from("courses")
            .update({ price: result.data.price, currency: result.data.currency })
            .eq("id", courseId)
            .select("id");

        if (error) throw error;

        // nothing updated → not his course (or it doesn't exist)
        if (updated.length === 0) {
            return NextResponse.json({ message: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Price saved" }, { status: 200 });
    } catch (error) {
        console.error("Update course pricing error:", error);
        return NextResponse.json({ message: "Failed to save the price" }, { status: 500 });
    }
}
