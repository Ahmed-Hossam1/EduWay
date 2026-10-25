"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { RefreshCw, Trash2, Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatVideoDuration } from "@/features/courses/utils/format";
import { LESSON_VIDEO_FORMATS, MAX_VIDEO_SIZE } from "../../constants";
import { useSaveLessonVideo } from "../../hooks/useSaveLessonVideo";
import { useRemoveLessonVideo } from "../../hooks/useRemoveLessonVideo";
import { CurriculumLesson } from "../../types";
import { getLessonVideoPublicId, getLessonVideoThumbnailUrl, getLessonVideoUrl } from "../../utils";

type LessonVideoProps = {
    lesson: CurriculumLesson;
};

/**
 * The video box under a lesson (its own box → its buttons can't be mixed up with the lesson ones):
 *   no video → an empty box + "Upload video"
 *   a video  → the preview (click → the video in a big window) + its length + "Replace video" / "Remove video"
 *
 * The file goes from the browser STRAIGHT to Cloudinary (not through our server):
 *   1- the widget asks our API to sign the upload (/api/cloudinary/sign-video checks it's HIS lesson)
 *   2- the widget uploads the file (it shows the progress bar)
 *   3- we tell our API "uploaded" → it reads the duration from Cloudinary and saves the video
 */
export function LessonVideo({ lesson }: LessonVideoProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { mutate: saveLessonVideo, isPending: isSaving } = useSaveLessonVideo();
    const { mutate: removeLessonVideo, isPending: isRemoving } = useRemoveLessonVideo();

    // one fixed name per lesson → "Replace" writes over the same file on Cloudinary
    // (no "folder" option: the name already has the folder, and our account is in "dynamic folder" mode)
    const uploadOptions = {
        resourceType: "video",
        publicId: getLessonVideoPublicId(lesson.id),
        sources: ["local" as const],
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: LESSON_VIDEO_FORMATS,
        maxFileSize: MAX_VIDEO_SIZE,
        singleUploadAutoClose: true,
    };

    return (
        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-3 sm:ml-9 sm:flex-row sm:items-center">
            {/* 1- the preview, or an empty box */}
            {lesson.has_video ? (
                <HeroVideoDialog
                    className="w-full shrink-0 sm:w-56"
                    animationStyle="from-center"
                    videoSrc={getLessonVideoUrl(lesson.id, lesson.video_version)}
                    thumbnailSrc={getLessonVideoThumbnailUrl(lesson.id, lesson.video_version)}
                    thumbnailAlt={`Video of ${lesson.title}`}
                />
            ) : (
                <div className="flex aspect-video w-full shrink-0 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground sm:w-56">
                    <Video className="size-6" />
                </div>
            )}

            {/* 2- what it is + its buttons (with words) */}
            <div className="min-w-0 flex-1 space-y-2">
                <div>
                    <p className="text-sm font-semibold">{lesson.has_video ? "Lesson video" : "No video yet"}</p>
                    <p className="text-xs text-muted-foreground">
                        {lesson.has_video
                            ? `Length: ${formatVideoDuration(lesson.duration_seconds)}`
                            : `${LESSON_VIDEO_FORMATS.join(", ").toUpperCase()} — up to ${MAX_VIDEO_SIZE / 1_000_000} MB`}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <CldUploadWidget
                        signatureEndpoint="/api/cloudinary/sign-video"
                        options={uploadOptions}
                        onSuccess={(result) => {
                            // result.info = what Cloudinary saved → send its real name to our API
                            if (result.info && typeof result.info !== "string") {
                                saveLessonVideo({ lessonId: lesson.id, publicId: result.info.public_id });
                            }
                        }}
                    >
                        {({ open, isLoading }) => (
                            <Button
                                type="button"
                                variant={lesson.has_video ? "outline" : "default"}
                                size="sm"
                                isLoading={isLoading || isSaving}
                                onClick={() => open()}
                            >
                                {isSaving ? (
                                    "Saving..."
                                ) : lesson.has_video ? (
                                    <>
                                        <RefreshCw />
                                        Replace video
                                    </>
                                ) : (
                                    <>
                                        <Upload />
                                        Upload video
                                    </>
                                )}
                            </Button>
                        )}
                    </CldUploadWidget>

                    {lesson.has_video && (
                        <Button type="button" variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>
                            <Trash2 />
                            Remove video
                        </Button>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Remove this video?"
                description={`The video of "${lesson.title}" will be deleted. The lesson stays, you can upload another video later.`}
                confirmLabel="Remove video"
                destructive
                isPending={isRemoving}
                onConfirm={() => removeLessonVideo(lesson.id, { onSuccess: () => setConfirmOpen(false) })}
            />
        </div>
    );
}
