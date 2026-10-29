import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cloudinary } from "@/lib/cloudinary/cloudinary";

// What the test page sends: the name of the video it just uploaded to Cloudinary
const hlsSchema = z.object({
    publicId: z.string().min(1),
});

/**
 * POST /api/testvideo  { publicId } → { hlsUrl }
 * TEST ONLY — learning how HLS works.
 *
 * The idea in 2 steps:
 *  1- the browser uploads the video (mp4, mov...) straight to Cloudinary (the upload widget)
 *  2- this route asks Cloudinary: "make an HLS copy of this video" → we get a .m3u8 link
 *
 * .m3u8 = a small text file (a "playlist") that points to many small pieces of the video,
 * in different qualities (360p, 720p, 1080p...). The player picks the quality that fits the internet speed.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = hlsSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ message: "Send the video publicId" }, { status: 400 });
        }
        const { publicId } = result.data;

        // explicit = "do something on a file that is ALREADY on Cloudinary" (no new upload)
        const video = await cloudinary.uploader.explicit(publicId, {
            type: "upload",
            resource_type: "video", // very important, or Cloudinary looks for an image
            eager: [
                // streaming_profile = the list of qualities to make, format m3u8 = HLS
                { streaming_profile: "full_hd", format: "m3u8" },
            ],
            // false = wait here until the HLS copy is ready (fine for a small test video).
            // A big video must use true (it is made in the background) → then you need a webhook later.
            eager_async: false,
        });

        // eager[0] = the result of our first (and only) eager item → its link is the .m3u8
        const hlsUrl: string = video.eager[0].secure_url;

        return NextResponse.json({ hlsUrl }, { status: 200 });
    } catch (error) {
        console.error("Test HLS error:", error);
        return NextResponse.json({ message: "Couldn't make the HLS video" }, { status: 500 });
    }
}
