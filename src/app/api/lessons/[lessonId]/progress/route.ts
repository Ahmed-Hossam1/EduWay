import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";

type Params = {
    params: Promise<{ lessonId: string }>;
};

const progressSchema = z.object({
    completed: z.boolean(), // true = done, false = not done
});

// complete_lesson() errors → status + what the student reads
const PROGRESS_ERRORS: Record<string, { status: number; message: string }> = {
    NOT_FOUND: { status: 404, message: "Lesson not found" },
    NOT_ENROLLED: { status: 403, message: "Enroll in this course to save your progress" },
};

// PUT /api/lessons/:lessonId/progress  { completed } → { completed, total, percent, courseCompleted }
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { lessonId } = await params;
        if (!z.uuid().safeParse(lessonId).success) {
            return NextResponse.json({ message: "A valid lessonId is required" }, { status: 400 });
        }

        const body = await request.json();
        const result = progressSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "completed must be true or false" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // the database marks the lesson + updates the enrollment (completed / active)
        const { data, error } = await supabase.rpc("complete_lesson", {
            p_lesson_id: lessonId,
            p_completed: result.data.completed,
        });

        if (error) {
            const known = PROGRESS_ERRORS[error.message];
            if (known) return NextResponse.json({ message: known.message }, { status: known.status });
            throw error;
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Lesson progress error:", error);
        return NextResponse.json({ message: "Failed to save your progress" }, { status: 500 });
    }
}
