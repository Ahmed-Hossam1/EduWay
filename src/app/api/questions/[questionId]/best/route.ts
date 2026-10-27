import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";
import { bestAnswerSchema } from "@/features/questions/schemas/questionSchemas";

type Params = {
    params: Promise<{ questionId: string }>; // the ANSWER to mark
};

// mark_best_answer() errors → status (its message is already for the user)
const BEST_ANSWER_STATUS: Record<string, number> = {
    P0002: 404, // the answer doesn't exist (or was deleted)
    "22023": 400, // a reply to a reply → not an answer of a question
    "42501": 403, // not the asker and not the instructor
};

// PUT /api/questions/:answerId/best { isBest } → mark / unmark the best answer (the asker or the teacher)
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { questionId } = await params;
        if (!z.uuid().safeParse(questionId).success) {
            return NextResponse.json({ message: "A valid questionId is required" }, { status: 400 });
        }

        const body = await request.json();
        const result = bestAnswerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "isBest must be true or false" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        const { error } = await supabase.rpc("mark_best_answer", {
            p_answer_id: questionId,
            p_is_best: result.data.isBest,
        });

        if (error) {
            const status = BEST_ANSWER_STATUS[error.code];
            if (status) return NextResponse.json({ message: error.message }, { status });
            throw error;
        }

        const message = result.data.isBest ? "Marked as the best answer" : "Best answer removed";
        return NextResponse.json({ message }, { status: 200 });
    } catch (error) {
        console.error("Best answer error:", error);
        return NextResponse.json({ message: "Failed to update the best answer" }, { status: 500 });
    }
}
