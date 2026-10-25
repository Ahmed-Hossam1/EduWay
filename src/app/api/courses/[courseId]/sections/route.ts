import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";
import { reorderSchema, titleSchema } from "@/features/course-builder/schemas/curriculumSchemas";

type Params = {
    params: Promise<{ courseId: string }>;
};

// add_section() errors → status + what the teacher reads
const ADD_ERRORS: Record<string, { status: number; message: string }> = {
    INVALID_TITLE: { status: 400, message: "The title should be 1 to 150 characters long" },
    NOT_FOUND: { status: 404, message: "Course not found" },
};

// POST /api/courses/:courseId/sections  { title } → the new section (at the end of the course)
export async function POST(request: NextRequest, { params }: Params) {
    try {
        const { courseId } = await params;
        if (!z.uuid().safeParse(courseId).success) {
            return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });
        }

        const body = await request.json().catch(() => null);
        const result = titleSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Write a section title" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // the database puts it at the end (last position + 1) and checks it is HIS course
        const { data, error } = await supabase.rpc("add_section", {
            p_course_id: courseId,
            p_title: result.data.title,
        });

        if (error) {
            const known = ADD_ERRORS[error.message];
            if (known) return NextResponse.json({ message: known.message }, { status: known.status });
            throw error;
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Add section error:", error);
        return NextResponse.json({ message: "Failed to add the section" }, { status: 500 });
    }
}

// PATCH /api/courses/:courseId/sections  { ids: [sectionId, ...] } → the sections in this new order
export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const { courseId } = await params;
        if (!z.uuid().safeParse(courseId).success) {
            return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });
        }

        const body = await request.json().catch(() => null);
        const result = reorderSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "A valid order is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // RLS: only HIS sections move (another teacher's ids change nothing)
        const { error } = await supabase.rpc("reorder_sections", {
            p_course_id: courseId,
            p_section_ids: result.data.ids,
        });

        if (error) throw error;

        return NextResponse.json({ message: "Sections reordered" }, { status: 200 });
    } catch (error) {
        console.error("Reorder sections error:", error);
        return NextResponse.json({ message: "Failed to save the new order" }, { status: 500 });
    }
}
