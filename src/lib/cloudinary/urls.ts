// The Cloudinary addresses of a video (safe in the browser: no secret here, only the public cloud name).
// version changes with every upload → the browser never shows an old file after a "Replace".
//
//   getVideoUrl("eduway/lessons/abc", 1792908224512)
//     → "https://res.cloudinary.com/<cloud>/video/upload/v1792908224512/eduway/lessons/abc.mp4"
//   getVideoThumbnailUrl("eduway/lessons/abc", 1792908224512)
//     → the same video, the picture at second 1, as a .jpg (Cloudinary makes it from the video)

const CLOUDINARY_VIDEO_BASE = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`;

export const getVideoUrl = (publicId: string, version: number | null) =>
    `${CLOUDINARY_VIDEO_BASE}/v${version ?? 1}/${publicId}.mp4`;

export const getVideoThumbnailUrl = (publicId: string, version: number | null) =>
    `${CLOUDINARY_VIDEO_BASE}/so_1/v${version ?? 1}/${publicId}.jpg`;
