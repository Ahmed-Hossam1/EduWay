import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary/cloudinary";
import { finishVideoHls } from "@/features/course-builder/server/finishVideoHls";

// One item of "eager" in Cloudinary's notification = one copy it made (we ask for one: the HLS .m3u8)
type EagerItem = {
    format?: string;
    secure_url?: string;
};

/**
 * POST /api/webhook/cloudinary  ← Cloudinary calls this, NOT the browser
 * When we ask Cloudinary for an HLS copy in the background (explicit + eager_async: true + eager_notification_url),
 * it calls this url when the copy is done → we save the .m3u8 link and the video becomes "ready".
 */
export async function POST(request: NextRequest) {
    // 1- The raw text body (the signature check needs it exactly as Cloudinary sent it)
    const body = await request.text();
    const timestamp = request.headers.get("X-Cld-Timestamp");
    const signature = request.headers.get("X-Cld-Signature");

    if (!timestamp || !signature) {
        return NextResponse.json({ message: "Missing timestamp or signature" }, { status: 400 });
    }

    // 2- Is it really Cloudinary? (anyone can send a POST to this url)
    //    signed with our secret + not older than 2 hours (the default)
    const isValid = cloudinary.utils.verifyNotificationSignature(body, Number(timestamp), signature);
    if (!isValid) {
        return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(body);

    // 3- Do the work for the notifications we care about
    try {
        switch (data.notification_type) {
            // the background copies (our HLS) are done
            case "eager": {
                const eager: EagerItem[] = data.eager ?? [];
                const hls = eager.find((item) => item.format === "m3u8" && item.secure_url);

                // no .m3u8 in the result → the conversion failed (the teacher can "Retry")
                const result = await finishVideoHls(data.public_id, hls?.secure_url ?? null);

                if (!result) console.warn(`Cloudinary HLS for an unknown video "${data.public_id}" (deleted?)`);
                break;
            }

            // other notifications (upload, delete...) → nothing to do for now
            default:
                break;
        }
    } catch (error) {
        // 500 → Cloudinary sends the same notification again later
        console.error(`Cloudinary webhook ${data.notification_type} error:`, error);
        return NextResponse.json({ message: "Webhook handler failed" }, { status: 500 });
    }

    // 4- 200 → Cloudinary stops sending this notification
    return NextResponse.json({ received: true }, { status: 200 });
}
