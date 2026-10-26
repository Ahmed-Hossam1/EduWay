import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";

// GET /api/enrollments → { courseIds: ["...", "..."] }  (the courses the logged-in user owns)
export async function GET() {
    try {
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // the database knows which courses he owns (refunded left out, newest first) → ["id", ...]
        const { data, error } = await supabase.rpc("get_my_course_ids");

        if (error) throw error;

        return NextResponse.json({ courseIds: data as string[] }, { status: 200 });
    } catch (error) {
        console.error("Get enrollments error:", error);
        return NextResponse.json({ message: "Failed to load your courses" }, { status: 500 });
    }
}

const enrollSchema = z.object({ courseId: z.uuid() });

// POST /api/enrollments  { courseId } → "Enroll for free"
// RLS allows it only for FREE published courses (paid ones are enrolled by the checkout).
// The database trigger also removes the course from the cart + wishlist and adds 1 to students_count.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = enrollSchema.safeParse(body);
        if (!result.success) return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        // double click → already enrolled → no error, no second row
        const { error } = await supabase
            .from("enrollments")
            .upsert(
                { user_id: user.id, course_id: result.data.courseId },
                { onConflict: "user_id,course_id", ignoreDuplicates: true },
            );

        if (error) {
            console.error("Enroll error:", error);
            // 42501 = blocked by RLS → paid course, unpublished, or your own course
            const message = error.code === "42501" ? "This course can't be enrolled for free" : "Failed to enroll";
            return NextResponse.json({ message }, { status: error.code === "42501" ? 403 : 500 });
        }

        return NextResponse.json({ message: "Enrolled successfully" }, { status: 201 });
    } catch (error) {
        console.error("Enroll error:", error);
        return NextResponse.json({ message: "Failed to enroll" }, { status: 500 });
    }
}
