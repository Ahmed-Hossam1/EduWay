"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { RefreshCw, Trash2, Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatVideoDuration } from "@/features/courses/utils/format";
import { LESSON_VIDEO_FORMATS, MAX_VIDEO_SIZE } from "../../constants";
import { useSaveLessonVideo } from "../../hooks/useSaveLessonVideo";
import { useRemoveLessonVideo } from "../../hooks/useRemoveLessonVideo";
import { CurriculumLesson } from "../../types";
import { getLessonVideoPublicId } from "../../utils";

type LessonVideoProps = {
    lesson: CurriculumLesson;
};

/**
 * The video part of a lesson row:
 *   no video → "Upload video"
 *   a video  → its duration + Replace + Remove
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
        <div className="flex shrink-0 items-center gap-1">
            {lesson.has_video && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Video className="size-3.5" />
                    {formatVideoDuration(lesson.duration_seconds)}
                </span>
            )}

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
                {({ open, isLoading }) =>
                    lesson.has_video ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Replace the video of ${lesson.title}`}
                            isLoading={isLoading || isSaving}
                            onClick={() => open()}
                        >
                            <RefreshCw />
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            isLoading={isLoading || isSaving}
                            onClick={() => open()}
                        >
                            {isSaving ? (
                                "Saving..."
                            ) : (
                                <>
                                    <Upload />
                                    Upload video
                                </>
                            )}
                        </Button>
                    )
                }
            </CldUploadWidget>

            {lesson.has_video && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove the video of ${lesson.title}`}
                    onClick={() => setConfirmOpen(true)}
                    className="text-muted-foreground hover:text-destructive"
                >
                    <Trash2 />
                </Button>
            )}

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Remove this video?"
                description={`The video of "${lesson.title}" will be deleted. You can upload another one later.`}
                confirmLabel="Remove video"
                destructive
                isPending={isRemoving}
                onConfirm={() => removeLessonVideo(lesson.id, { onSuccess: () => setConfirmOpen(false) })}
            />
        </div>
    );
}
