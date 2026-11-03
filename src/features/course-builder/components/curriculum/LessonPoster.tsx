"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImageMinus, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LESSON_POSTER_FORMATS, MAX_POSTER_SIZE } from "../../constants";
import { useRemoveLessonPoster } from "../../hooks/useRemoveLessonPoster";
import { useSaveLessonPoster } from "../../hooks/useSaveLessonPoster";
import { CurriculumLesson } from "../../types";
import { getLessonPosterPublicId } from "../../utils";

type LessonPosterProps = {
    lesson: CurriculumLesson;
};

/**
 * The poster buttons under the video buttons (only when the lesson has a video):
 *   video processing → the buttons are disabled: "Waiting for the stream..."
 *   no poster        → "Upload poster" (the student sees a frame of the video before playing)
 *   a poster         → "Replace poster" + "Remove poster"
 *
 * Same steps as the video: the widget asks our API to sign the upload (/api/cloudinary/sign-lesson-upload),
 * uploads the picture straight to Cloudinary, then we tell our API "uploaded" → it saves it as the poster.
 */
export function LessonPoster({ lesson }: LessonPosterProps) {
    const { mutate: saveLessonPoster, isPending: isSaving } = useSaveLessonPoster();
    const { mutate: removeLessonPoster, isPending: isRemoving } = useRemoveLessonPoster();

    const hasPoster = !!lesson.poster_url;
    const isProcessing = lesson.video_status === "processing"; // wait until the stream is ready

    // one fixed name per lesson → "Replace" writes over the same picture on Cloudinary
    const uploadOptions = {
        resourceType: "image",
        publicId: getLessonPosterPublicId(lesson.id),
        sources: ["local" as const],
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: LESSON_POSTER_FORMATS,
        maxFileSize: MAX_POSTER_SIZE,
        singleUploadAutoClose: true,
    };

    // the words on the upload button
    let uploadLabel = hasPoster ? "Replace poster" : "Upload poster";
    if (isProcessing) uploadLabel = "Waiting for the stream...";
    if (isSaving) uploadLabel = "Saving...";

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Poster:</span>

            <CldUploadWidget
                signatureEndpoint="/api/cloudinary/sign-lesson-upload"
                options={uploadOptions}
                onSuccess={(result) => {
                    // uploaded → send its real name to our API right away (it saves it as the poster)
                    if (result.info && typeof result.info !== "string") {
                        saveLessonPoster({ lessonId: lesson.id, publicId: result.info.public_id });
                    }
                }}
            >
                {({ open, isLoading }) => (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isProcessing}
                        isLoading={isLoading || isSaving}
                        onClick={() => open()}
                    >
                        {!isSaving && <ImagePlus />}
                        {uploadLabel}
                    </Button>
                )}
            </CldUploadWidget>

            {hasPoster && (
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isProcessing}
                    isLoading={isRemoving}
                    onClick={() => removeLessonPoster(lesson.id)}
                >
                    {isRemoving ? (
                        "Removing..."
                    ) : (
                        <>
                            <ImageMinus />
                            Remove poster
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}
