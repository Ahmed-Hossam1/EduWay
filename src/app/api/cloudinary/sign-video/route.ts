import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cloudinary } from "@/lib/cloudinary/cloudinary";
import { requireUser } from "@/lib/supabase/requireUser";
import { LESSON_VIDEO_FOLDER } from "@/features/course-builder/constants";

// What the Cloudinary upload widget sends: the upload params it wants us to sign
const signSchema = z.object({
    paramsToSign: z.record(z.string(), z.unknown()),
});

/**
 * POST /api/cloudinary/sign-video  { paramsToSign } → { signature }
 * The upload widget (CldUploadWidget signatureEndpoint) calls it before a lesson video upload.
 * We sign ONLY an upload to "eduway/lessons/<id of a lesson of THIS teacher>",
 * so nobody can upload to our account, or write over another teacher's video.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => null);
        const result = signSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Nothing to sign" }, { status: 400 });
        }
        const { paramsToSign } = result.data;

        // 1- the video name must be "eduway/lessons/<lesson id>"
        const publicId = String(paramsToSign.public_id ?? "");
        const lessonId = publicId.replace(`${LESSON_VIDEO_FOLDER}/`, "");
        if (!publicId.startsWith(`${LESSON_VIDEO_FOLDER}/`) || !z.uuid().safeParse(lessonId).success) {
            return NextResponse.json({ message: "Invalid video name" }, { status: 400 });
        }

        // 2- logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        // 3- is it a lesson of HIS course? (lesson → section → course → instructor)
        const { data: lesson, error } = await supabase
            .from("lessons")
            .select("id, sections!inner(courses!inner(instructor_id))")
            .eq("id", lessonId)
            .eq("sections.courses.instructor_id", user.id)
            .maybeSingle();

        if (error) throw error;
        if (!lesson) return NextResponse.json({ message: "Lesson not found" }, { status: 404 });

        // 4- sign with the secret (on the server only) — the same secret as lib/cloudinary (ONE place)
        const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudinary.config().api_secret!);

        return NextResponse.json({ signature }, { status: 200 });
    } catch (error) {
        console.error("Sign video upload error:", error);
        return NextResponse.json({ message: "Couldn't start the upload" }, { status: 500 });
    }
}
