import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";
import { courseDetailsSchema } from "@/features/course-builder/schemas/courseDetailsSchema";

type Params = {
    params: Promise<{ courseId: string }>;
};

// update_course_details() errors → status + what the teacher reads
const DETAILS_ERRORS: Record<string, { status: number; message: string }> = {
    NOT_FOUND: { status: 404, message: "Course not found" },
    NOT_APPROVED_TEACHER: { status: 403, message: "Only approved teachers can edit courses" },
    INVALID_CATEGORY: { status: 400, message: "Choose at least one valid category" },
};

// PATCH /api/courses/:courseId/details  { title, shortDescription, ... } → saves the Details tab
export async function PATCH(request: NextRequest, { params }: Params) {
    try {
        const { courseId } = await params;
        if (!z.uuid().safeParse(courseId).success) {
            return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });
        }

        // 1- Check the data with the SAME schema as the form
        const body = await request.json();
        const result = courseDetailsSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid course details", errors: result.error.flatten().fieldErrors },
                { status: 400 },
            );
        }

        // 2- Logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // 3- The database saves everything in ONE step (course + categories + tags + prerequisites)
        //    and checks it is HIS course
        const { error } = await supabase.rpc("update_course_details", {
            p_course_id: courseId,
            p_data: result.data,
        });

        if (error) {
            const known = DETAILS_ERRORS[error.message];
            if (known) return NextResponse.json({ message: known.message }, { status: known.status });
            throw error;
        }

        return NextResponse.json({ message: "Course details saved" }, { status: 200 });
    } catch (error) {
        console.error("Update course details error:", error);
        return NextResponse.json({ message: "Failed to save the course details" }, { status: 500 });
    }
}
