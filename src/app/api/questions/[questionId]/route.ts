import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";
import { commentTextSchema } from "@/features/comments/schemas/commentSchemas";

type Params = {
    params: Promise<{ questionId: string }>;
};

// PATCH /api/questions/:questionId { body } → edit YOUR question / answer (RLS: only your own, not deleted)
export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const { questionId } = await params;
        if (!z.uuid().safeParse(questionId).success) {
            return NextResponse.json({ message: "A valid questionId is required" }, { status: 400 });
        }

        const body = await request.json();
        const result = commentTextSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: result.error.issues[0].message }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        const { data, error } = await supabase
            .from("questions")
            .update({ body: result.data.body })
            .eq("id", questionId)
            .select("id");

        if (error) throw error;
        // no row changed → not found, not yours, or deleted
        if (data.length === 0) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Comment updated" }, { status: 200 });
    } catch (error) {
        console.error("Update question error:", error);
        return NextResponse.json({ message: "Failed to update your comment" }, { status: 500 });
    }
}

// DELETE /api/questions/:questionId → the database decides: real delete, or "This comment was deleted" (has replies)
export async function DELETE(_request: NextRequest, { params }: Params) {
    try {
        const { questionId } = await params;
        if (!z.uuid().safeParse(questionId).success) {
            return NextResponse.json({ message: "A valid questionId is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        const { error } = await supabase.rpc("delete_question", { p_question_id: questionId });

        if (error) {
            // P0002 = not found, not yours, or already deleted
            if (error.code === "P0002") {
                return NextResponse.json({ message: "Comment not found" }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
    } catch (error) {
        console.error("Delete question error:", error);
        return NextResponse.json({ message: "Failed to delete your comment" }, { status: 500 });
    }
}
