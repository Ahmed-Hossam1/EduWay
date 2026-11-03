import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cloudinary } from "@/lib/cloudinary/cloudinary";
import { requireUser } from "@/lib/supabase/requireUser";
import { LESSON_POSTER_FOLDER, LESSON_VIDEO_FOLDER } from "@/features/course-builder/constants";

// What the Cloudinary upload widget sends: the upload params it wants us to sign
const signSchema = z.object({
    paramsToSign: z.record(z.string(), z.unknown()),
});

// The 2 things a teacher uploads for a lesson: its video and its poster
const LESSON_FOLDERS = [LESSON_VIDEO_FOLDER, LESSON_POSTER_FOLDER];

/**
 * POST /api/cloudinary/sign-lesson-upload  { paramsToSign } → { signature }
 * The upload widget (CldUploadWidget signatureEndpoint) calls it before a lesson video / poster upload.
 * We sign ONLY an upload to "eduway/lessons/<id>" or "eduway/lesson-posters/<id>" of a lesson of THIS teacher,
 * so nobody can upload to our account, or write over another teacher's file.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = signSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Nothing to sign" }, { status: 400 });
        }
        const { paramsToSign } = result.data;

        // 1- the file name must be "<one of our lesson folders>/<lesson id>"
        const publicId = String(paramsToSign.public_id ?? "");
        const folder = LESSON_FOLDERS.find((item) => publicId.startsWith(`${item}/`));
        const lessonId = folder ? publicId.replace(`${folder}/`, "") : "";
        if (!folder || !z.uuid().safeParse(lessonId).success) {
            return NextResponse.json({ message: "Invalid file name" }, { status: 400 });
        }

        // 2- logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase } = auth;

        // 3- is it a lesson of HIS course? (the database checks lesson → section → course → instructor)
        const { data: isMine, error } = await supabase.rpc("is_my_lesson", { p_lesson_id: lessonId });

        if (error) throw error;
        if (!isMine) return NextResponse.json({ message: "Lesson not found" }, { status: 404 });

        // 4- sign with the secret (on the server only) — the same secret as lib/cloudinary (ONE place)
        const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudinary.config().api_secret!);

        return NextResponse.json({ signature }, { status: 200 });
    } catch (error) {
        console.error("Sign lesson upload error:", error);
        return NextResponse.json({ message: "Couldn't start the upload" }, { status: 500 });
    }
}
