import "server-only";
import { v2 as cloudinary } from "cloudinary";

/* Cloudinary on the SERVER (the secret never reaches the browser — "server-only" breaks the build if it does)

 Used for the lesson videos + the course preview videos:
 - sign an upload (only our server can allow an upload to our account)
 - read the real duration of an uploaded video
 - make its HLS copy (.m3u8, the only link the player uses) and check if it is done
 - delete a video / an image that is not used anymore
*/

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure: true,
});

export { cloudinary };

// The HLS copy we ask for: many qualities (up to 1080p, Cloudinary's "full_hd" list) as a .m3u8 playlist
const HLS_EAGER = [{ streaming_profile: "full_hd", format: "m3u8" }];

/**
 * Ask Cloudinary to make the HLS (.m3u8) copy of an uploaded video, IN THE BACKGROUND.
 * explicit = "do something on a file that is already on Cloudinary" (no new upload).
 * eager_async: true → this call returns right away; a long video can take minutes.
 * When the copy is done, Cloudinary calls our webhook (/api/webhook/cloudinary) → the video becomes "ready".
 * No CLOUDINARY_NOTIFICATION_URL (localhost without a tunnel) → no call; the Curriculum page asks instead
 * (findVideoHlsUrl).
 */
export async function startVideoHls(publicId: string) {
    await cloudinary.uploader.explicit(publicId, {
        type: "upload",
        resource_type: "video", // or Cloudinary looks for an image
        eager: HLS_EAGER,
        eager_async: true,
        eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL || undefined,
    });
}

/**
 * Is the HLS copy of this video made? → its .m3u8 link, or null (not yet)
 * The backup of the webhook: the Curriculum page asks this while a video is "processing".
 * Only a copy of the CURRENT file counts: after "Replace" the old file's copy has another version (v<number>).
 */
export async function findVideoHlsUrl(publicId: string): Promise<string | null> {
    const video = await cloudinary.api.resource(publicId, { resource_type: "video" });
    const derived: { secure_url?: string }[] = video.derived ?? [];

    const hls = derived.find(
        (copy) => copy.secure_url?.endsWith(".m3u8") && copy.secure_url.includes(`/v${video.version}/`),
    );
    return hls?.secure_url ?? null;
}

// Delete some images (a lesson poster, an old course image). A failed delete is only logged (like the videos).
export async function deleteCloudinaryImages(publicIds: string[]) {
    for (const publicId of publicIds) {
        try {
            await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
        } catch (error) {
            console.error(`Couldn't delete the image ${publicId} from Cloudinary:`, error);
        }
    }
}

// Delete some videos from Cloudinary. A failed delete is only logged:
// the database change is already done, a leftover file must not break the request.
export async function deleteCloudinaryVideos(publicIds: string[]) {
    for (const publicId of publicIds) {
        try {
            await cloudinary.uploader.destroy(publicId, { resource_type: "video", invalidate: true });
        } catch (error) {
            console.error(`Couldn't delete the video ${publicId} from Cloudinary:`, error);
        }
    }
}
