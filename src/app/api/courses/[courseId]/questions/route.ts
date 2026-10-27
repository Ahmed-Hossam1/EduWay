import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/requireUser";
import { COMMENTS_PAGE_SIZE } from "@/features/comments/constants";
import { createQuestionSchema, questionsQuerySchema } from "@/features/questions/schemas/questionSchemas";

type Params = {
    params: Promise<{ courseId: string }>;
};

// GET /api/courses/:courseId/questions?lessonId=...&sort=newest&offset=10 → one page of questions
//   no lessonId → the course page questions (guests too) | lessonId → that lesson (buyers + the teacher)
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { courseId } = await params;
        if (!z.uuid().safeParse(courseId).success) {
            return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });
        }

        const { lessonId, sort, offset } = questionsQuerySchema.parse({
            lessonId: request.nextUrl.searchParams.get("lessonId"),
            sort: request.nextUrl.searchParams.get("sort"),
            offset: request.nextUrl.searchParams.get("offset"),
        });

        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase.rpc("get_course_questions", {
            p_course_id: courseId,
            p_lesson_id: lessonId,
            p_sort: sort,
            p_limit: COMMENTS_PAGE_SIZE,
            p_offset: offset,
        });

        if (error) throw error;
        if (!data) return NextResponse.json({ message: "Questions not found" }, { status: 404 });

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Get questions error:", error);
        return NextResponse.json({ message: "Failed to load the questions" }, { status: 500 });
    }
}

/**
 * POST /api/courses/:courseId/questions { body, lessonId?, parentId? }
 *   a question or an answer. The database (RLS) decides who can write where;
 *   the trigger sends the notifications.
 */
export async function POST(request: NextRequest, { params }: Params) {
    try {
        const { courseId } = await params;
        if (!z.uuid().safeParse(courseId).success) {
            return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });
        }

        const body = await request.json();
        const result = createQuestionSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: result.error.issues[0].message }, { status: 400 });
        }
        const { lessonId, parentId, body: text } = result.data;

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        const { data, error } = await supabase
            .from("questions")
            .insert({ course_id: courseId, lesson_id: lessonId ?? null, parent_id: parentId ?? null, body: text })
            .select("id")
            .single();

        if (error) {
            // 42501 = the RLS policy said no
            if (error.code === "42501") {
                const message = parentId
                    ? "Only the instructor and enrolled students can answer here"
                    : "Only enrolled students can ask questions about the lessons";
                return NextResponse.json({ message }, { status: 403 });
            }
            throw error;
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Create question error:", error);
        return NextResponse.json({ message: "Failed to post your comment" }, { status: 500 });
    }
}
