import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/requireUser";
import { REVIEWS_PAGE_SIZE } from "@/features/reviews/constants";
import { createReplySchema, reviewSchema, reviewsQuerySchema } from "@/features/reviews/schemas/reviewSchemas";

type Params = {
    params: Promise<{ courseId: string }>;
};

// GET /api/courses/:courseId/reviews?sort=newest&offset=10 → one page of reviews (guests too)
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { courseId } = await params;
        if (!z.uuid().safeParse(courseId).success) {
            return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });
        }

        const { sort, offset } = reviewsQuerySchema.parse({
            sort: request.nextUrl.searchParams.get("sort"),
            offset: request.nextUrl.searchParams.get("offset"),
        });

        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.rpc("get_course_reviews", {
            p_course_id: courseId,
            p_sort: sort,
            p_limit: REVIEWS_PAGE_SIZE,
            p_offset: offset,
        });

        if (error) throw error;
        if (!data) return NextResponse.json({ message: "Course not found" }, { status: 404 });

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Get reviews error:", error);
        return NextResponse.json({ message: "Failed to load the reviews" }, { status: 500 });
    }
}

/**
 * POST /api/courses/:courseId/reviews
 *   { rating, body }     → a review (enrolled students only, one per course)
 *   { parentId, body }   → a reply to that comment (anyone logged in)
 * The database (RLS) decides who can write; the triggers update the rating + send the notifications.
 */
export async function POST(request: NextRequest, { params }: Params) {
    try {
        const { courseId } = await params;
        if (!z.uuid().safeParse(courseId).success) {
            return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });
        }

        const body = await request.json();
        const isReply = Boolean(body?.parentId);

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        let newRow;
        if (isReply) {
            const result = createReplySchema.safeParse(body);
            if (!result.success) {
                return NextResponse.json({ message: result.error.issues[0].message }, { status: 400 });
            }
            newRow = { course_id: courseId, parent_id: result.data.parentId, body: result.data.body };
        } else {
            const result = reviewSchema.safeParse(body);
            if (!result.success) {
                return NextResponse.json({ message: result.error.issues[0].message }, { status: 400 });
            }
            // an empty text → null (the database refuses "")
            newRow = { course_id: courseId, rating: result.data.rating, body: result.data.body || null };
        }

        const { data, error } = await supabase.from("reviews").insert(newRow).select("id").single();

        if (error) {
            // 42501 = the RLS policy said no
            if (error.code === "42501") {
                const message = isReply
                    ? "You can't reply to this comment"
                    : "Only students enrolled in this course can review it";
                return NextResponse.json({ message }, { status: 403 });
            }
            // 23505 = the "one review per student" rule
            if (error.code === "23505") {
                return NextResponse.json({ message: "You already reviewed this course" }, { status: 409 });
            }
            throw error;
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Create review error:", error);
        return NextResponse.json({ message: "Failed to post your comment" }, { status: 500 });
    }
}
