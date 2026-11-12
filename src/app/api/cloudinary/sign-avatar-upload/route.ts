import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cloudinary } from "@/lib/cloudinary/cloudinary";
import { requireUser } from "@/lib/supabase/requireUser";

// What the Cloudinary upload widget sends: the upload params it wants us to sign
const signSchema = z.object({
    paramsToSign: z.record(z.string(), z.unknown()),
});

export const AVATAR_FOLDER = "eduway/avatars";

/**
 * POST /api/cloudinary/sign-avatar-upload  { paramsToSign } → { signature }
 * The upload widget (CldUploadWidget signatureEndpoint) calls it before a profile photo upload.
 * Only authenticated users can upload avatars, and uploads are stored under eduway/avatars.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = signSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Nothing to sign" }, { status: 400 });
        }
        const { paramsToSign } = result.data;

        // 1- User must be logged in
        const auth = await requireUser();
        if (!auth.ok) return auth.response;

        // 2- Validate destination folder/public_id
        const folder = String(paramsToSign.folder ?? "");
        const publicId = String(paramsToSign.public_id ?? "");

        const isValidTarget =
            folder.startsWith(AVATAR_FOLDER) ||
            publicId.startsWith(AVATAR_FOLDER) ||
            (!folder && !publicId);

        if (!isValidTarget) {
            return NextResponse.json({ message: "Invalid avatar upload destination" }, { status: 400 });
        }

        // 3- Sign with the secret (on the server only)
        const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudinary.config().api_secret!);

        return NextResponse.json({ signature }, { status: 200 });
    } catch (error) {
        console.error("Sign avatar upload error:", error);
        return NextResponse.json({ message: "Couldn't start the upload" }, { status: 500 });
    }
}

