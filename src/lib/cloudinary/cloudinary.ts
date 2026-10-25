import "server-only";
import { v2 as cloudinary } from "cloudinary";

/* Cloudinary on the SERVER (the secret never reaches the browser — "server-only" breaks the build if it does)

 Used for the lesson videos:
 - sign an upload (only our server can allow an upload to our account)
 - read the real duration of an uploaded video
 - delete a video that is not used anymore
*/

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure: true,
});

export { cloudinary };

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
