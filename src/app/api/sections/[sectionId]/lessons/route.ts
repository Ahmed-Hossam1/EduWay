import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";
import { reorderSchema, titleSchema } from "@/features/course-builder/schemas/curriculumSchemas";

type Params = {
    params: Promise<{ sectionId: string }>;
};

// add_lesson() errors → status + what the teacher reads
const ADD_ERRORS: Record<string, { status: number; message: string }> = {
    INVALID_TITLE: { status: 400, message: "The title should be 1 to 150 characters long" },
    NOT_FOUND: { status: 404, message: "Section not found" },
};

// POST /api/sections/:sectionId/lessons  { title } → the new lesson (at the end of the section)
export async function POST(request: NextRequest, { params }: Params) {
    try {
        const { sectionId } = await params;
        if (!z.uuid().safeParse(sectionId).success) {
            return NextResponse.json({ message: "A valid sectionId is required" }, { status: 400 });
        }

        const body = await request.json();
        const result = titleSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Write a lesson title" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // the database puts it at the end of the section and checks it is HIS course
        const { data, error } = await supabase.rpc("add_lesson", {
            p_section_id: sectionId,
            p_title: result.data.title,
        });

        if (error) {
            const known = ADD_ERRORS[error.message];
            if (known) return NextResponse.json({ message: known.message }, { status: known.status });
            throw error;
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Add lesson error:", error);
        return NextResponse.json({ message: "Failed to add the lesson" }, { status: 500 });
    }
}

// PATCH /api/sections/:sectionId/lessons  { ids: [lessonId, ...] } → the lessons of the section in this new order
export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const { sectionId } = await params;
        if (!z.uuid().safeParse(sectionId).success) {
            return NextResponse.json({ message: "A valid sectionId is required" }, { status: 400 });
        }

        const body = await request.json();
        const result = reorderSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "A valid order is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // RLS: only HIS lessons move
        const { error } = await supabase.rpc("reorder_lessons", {
            p_section_id: sectionId,
            p_lesson_ids: result.data.ids,
        });

        if (error) throw error;

        return NextResponse.json({ message: "Lessons reordered" }, { status: 200 });
    } catch (error) {
        console.error("Reorder lessons error:", error);
        return NextResponse.json({ message: "Failed to save the new order" }, { status: 500 });
    }
}
