import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// GET /api/enrollments → { courseIds: ["...", "..."] }  (the courses the logged-in user owns)
export async function GET() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user.id) // a teacher also sees his students' rows → keep only his own
        .neq("status", "refunded") // a refunded course is not owned anymore
        .order("enrolled_at", { ascending: false });

    if (error) {
        console.error("Get enrollments error:", error);
        return NextResponse.json({ message: "Failed to load your courses" }, { status: 500 });
    }

    return NextResponse.json({ courseIds: data.map((item) => item.course_id) }, { status: 200 });
}

const enrollSchema = z.object({ courseId: z.uuid() });

// POST /api/enrollments  { courseId } → "Enroll for free"
// RLS allows it only for FREE published courses (paid ones are enrolled by the checkout, later).
// The database trigger also removes the course from the cart + wishlist and adds 1 to students_count.
export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const result = enrollSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });

    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

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
}
