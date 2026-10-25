import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/requireUser";
import { createCourseSchema } from "@/features/course-builder/schemas/createCourseSchema";

// create_course() errors → status + what the teacher reads
const CREATE_ERRORS: Record<string, { status: number; message: string }> = {
    NOT_APPROVED_TEACHER: { status: 403, message: "Only approved teachers can create courses" },
    INVALID_TITLE: { status: 400, message: "The title should be 3 to 150 characters long" },
    INVALID_CATEGORY: { status: 400, message: "Choose a valid category" },
};

// POST /api/courses  { title, categoryId } → { courseId }  (a new DRAFT course of the logged-in teacher)
export async function POST(request: NextRequest) {
    try {
        // 1- Check the data with the SAME schema as the form
        const body = await request.json()
        const result = createCourseSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid course data", errors: result.error.flatten().fieldErrors },
                { status: 400 },
            );
        }

        // 2- Logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // 3- The database makes the draft (+ its slug and category) and checks he is an approved teacher
        const { data: courseId, error } = await supabase.rpc("create_course", {
            p_title: result.data.title,
            p_category_id: result.data.categoryId,
        });

        if (error) {
            const known = CREATE_ERRORS[error.message];
            if (known) return NextResponse.json({ message: known.message }, { status: known.status });
            throw error;
        }

        return NextResponse.json({ courseId: courseId as string }, { status: 201 });
    } catch (error) {
        console.error("Create course error:", error);
        return NextResponse.json({ message: "Failed to create the course" }, { status: 500 });
    }
}
