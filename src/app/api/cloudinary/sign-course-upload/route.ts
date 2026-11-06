import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cloudinary } from "@/lib/cloudinary/cloudinary";
import { checkCourseAccess } from "@/features/teacher-courses/server/checkCourseAccess";
import { COURSE_PREVIEW_FOLDER, COURSE_THUMBNAIL_FOLDER } from "@/features/course-builder/constants";

// What the Cloudinary upload widget sends: the upload params it wants us to sign
const signSchema = z.object({
    paramsToSign: z.record(z.string(), z.unknown()),
});

const UUID_LENGTH = 36; // "56e0ed8d-ba40-4bec-a816-f7071633241a"

/**
 * Which course is this file for? → its id, or null when the name is not one of ours:
 *   "eduway/course-previews/<course id>"                  (the preview video: one fixed name)
 *   "eduway/course-thumbnails/<course id>-<time>"         (the course image: a new name every upload)
 */
const getCourseIdFromPublicId = (publicId: string) => {
    if (publicId.startsWith(`${COURSE_PREVIEW_FOLDER}/`)) {
        const courseId = publicId.replace(`${COURSE_PREVIEW_FOLDER}/`, "");
        return z.uuid().safeParse(courseId).success ? courseId : null;
    }

    if (publicId.startsWith(`${COURSE_THUMBNAIL_FOLDER}/`)) {
        const name = publicId.replace(`${COURSE_THUMBNAIL_FOLDER}/`, ""); // "<course id>-<time>"
        const courseId = name.slice(0, UUID_LENGTH);
        const time = name.slice(UUID_LENGTH); // "-1793468535123"
        return z.uuid().safeParse(courseId).success && /^-\d+$/.test(time) ? courseId : null;
    }

    return null;
};

/**
 * POST /api/cloudinary/sign-course-upload  { paramsToSign } → { signature }
 * The upload widget (CldUploadWidget signatureEndpoint) calls it before a course image / preview video upload.
 * We sign ONLY an upload with the name of a course of THIS teacher,
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

        // 1- the file name must be one of our course names
        const courseId = getCourseIdFromPublicId(String(paramsToSign.public_id ?? ""));
        if (!courseId) {
            return NextResponse.json({ message: "Invalid file name" }, { status: 400 });
        }

        // 2- logged in + approved teacher + HIS course (401 / 403 / 404)
        const access = await checkCourseAccess(courseId, "course:update");
        if (!access.ok) return access.response;

        // 3- sign with the secret (on the server only) — the same secret as lib/cloudinary (ONE place)
        const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudinary.config().api_secret!);

        return NextResponse.json({ signature }, { status: 200 });
    } catch (error) {
        console.error("Sign course upload error:", error);
        return NextResponse.json({ message: "Couldn't start the upload" }, { status: 500 });
    }
}
