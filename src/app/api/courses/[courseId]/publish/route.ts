import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/requireUser";
import { PublishResult } from "@/features/course-builder/types";

type Params = {
    params: Promise<{ courseId: string }>;
};

// publish_course() errors → status + what the teacher reads
const PUBLISH_ERRORS: Record<string, { status: number; message: string }> = {
    NOT_FOUND: { status: 404, message: "Course not found" },
    NOT_APPROVED_TEACHER: { status: 403, message: "Only approved teachers can publish courses" },
    ALREADY_PUBLISHED: { status: 409, message: "This course is already published" },
};

// POST /api/courses/:courseId/publish → { published: true, missing: [] } | 400 { message, missing }
export async function POST(_request: Request, { params }: Params) {
    try {
        const { courseId } = await params;
        if (!z.uuid().safeParse(courseId).success) {
            return NextResponse.json({ message: "A valid courseId is required" }, { status: 400 });
        }

        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // The database checks the publish rules (description, image, category...) and publishes
        const { data, error } = await supabase.rpc("publish_course", { p_course_id: courseId });

        if (error) {
            const known = PUBLISH_ERRORS[error.message];
            if (known) return NextResponse.json({ message: known.message }, { status: known.status });
            throw error;
        }

        const result = data as PublishResult;

        // something is still missing → not published (the page shows the checklist)
        if (!result.published) {
            return NextResponse.json(
                { message: "Finish the checklist before publishing", missing: result.missing },
                { status: 400 },
            );
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Publish course error:", error);
        return NextResponse.json({ message: "Failed to publish the course" }, { status: 500 });
    }
}
