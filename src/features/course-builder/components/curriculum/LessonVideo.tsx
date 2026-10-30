"use client";

import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { AlertTriangle, Loader2, Play, RefreshCw, RotateCcw, Trash2, Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { formatVideoDuration } from "@/features/courses/utils/format";
import { LESSON_VIDEO_FORMATS, MAX_VIDEO_SIZE } from "../../constants";
import { useLessonVideoHlsStatus } from "../../hooks/useLessonVideoHlsStatus";
import { useRemoveLessonVideo } from "../../hooks/useRemoveLessonVideo";
import { useRetryLessonVideoHls } from "../../hooks/useRetryLessonVideoHls";
import { useSaveLessonVideo } from "../../hooks/useSaveLessonVideo";
import { CurriculumLesson } from "../../types";
import { getLessonVideoPublicId, getLessonVideoThumbnailUrl } from "../../utils";

type LessonVideoProps = {
    lesson: CurriculumLesson;
};

/**
 * The video box under a lesson (its own box → its buttons can't be mixed up with the lesson ones):
 *   no video   → an empty box + "Upload video"
 *   processing → "Preparing for streaming..." (Cloudinary makes the HLS copy; we check every 5 seconds)
 *   failed     → "Preparing failed" + "Retry" (no new upload)
 *   ready      → the preview (click → the HLS video in a window) + its length + "Replace" / "Remove"
 *
 * The file goes from the browser STRAIGHT to Cloudinary (not through our server):
 *   1- the widget asks our API to sign the upload (/api/cloudinary/sign-video checks it's HIS lesson)
 *   2- the widget uploads the file (it shows the progress bar)
 *   3- right after, we tell our API "uploaded" → it saves the video and starts its HLS copy (by itself)
 */
export function LessonVideo({ lesson }: LessonVideoProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const { mutate: saveLessonVideo, isPending: isSaving } = useSaveLessonVideo();
    const { mutate: removeLessonVideo, isPending: isRemoving } = useRemoveLessonVideo();
    const { mutate: retryHls, isPending: isRetrying } = useRetryLessonVideoHls();

    // while "processing": asks the server every 5 seconds, the page reloads when it is ready / failed
    useLessonVideoHlsStatus(lesson.id, lesson.video_status);

    const status = lesson.video_status; // null = no video
    const thumbnail = lesson.poster_url ?? getLessonVideoThumbnailUrl(lesson.id, lesson.video_version);

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

    // the words under "Lesson video"
    let subtitle = `${LESSON_VIDEO_FORMATS.join(", ").toUpperCase()} — up to ${MAX_VIDEO_SIZE / 1_000_000} MB`;
    if (status === "ready") subtitle = `Length: ${formatVideoDuration(lesson.duration_seconds)}`;
    if (status === "processing") subtitle = "Preparing for streaming... This can take a few minutes.";
    if (status === "failed") subtitle = "Preparing the video failed. Retry, or upload it again.";

    return (
        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-3 sm:ml-9 sm:flex-row sm:items-center">
            {/* 1- the box: the preview / preparing / failed / empty */}
            <div className="relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground sm:w-56">
                {status === "ready" && lesson.hls_url && (
                    <button
                        type="button"
                        className="group absolute inset-0 cursor-pointer"
                        aria-label={`Watch the video of ${lesson.title}`}
                        onClick={() => setPreviewOpen(true)}
                    >
                        <Image src={thumbnail} alt="" fill sizes="224px" className="object-cover" />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
                            <Play className="size-8 fill-white text-white" />
                        </span>
                    </button>
                )}
                {status === "processing" && <Loader2 className="size-6 animate-spin" />}
                {status === "failed" && <AlertTriangle className="size-6 text-destructive" />}
                {!status && <Video className="size-6" />}
            </div>

            {/* 2- what it is + its buttons (with words) */}
            <div className="min-w-0 flex-1 space-y-2">
                <div>
                    <p className="text-sm font-semibold">{status ? "Lesson video" : "No video yet"}</p>
                    <p className={status === "failed" ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
                        {subtitle}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {status === "failed" && (
                        <Button type="button" size="sm" isLoading={isRetrying} onClick={() => retryHls(lesson.id)}>
                            {isRetrying ? (
                                "Retrying..."
                            ) : (
                                <>
                                    <RotateCcw />
                                    Retry
                                </>
                            )}
                        </Button>
                    )}

                    <CldUploadWidget
                        signatureEndpoint="/api/cloudinary/sign-video"
                        options={uploadOptions}
                        onSuccess={(result) => {
                            // uploaded → send its real name to our API right away (it starts the HLS copy)
                            if (result.info && typeof result.info !== "string") {
                                saveLessonVideo({ lessonId: lesson.id, publicId: result.info.public_id });
                            }
                        }}
                    >
                        {({ open, isLoading }) => (
                            <Button
                                type="button"
                                variant={status ? "outline" : "default"}
                                size="sm"
                                isLoading={isLoading || isSaving}
                                onClick={() => open()}
                            >
                                {isSaving ? (
                                    "Saving..."
                                ) : status ? (
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

                    {status && (
                        <Button type="button" variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>
                            <Trash2 />
                            Remove video
                        </Button>
                    )}
                </div>
            </div>

            {/* the preview: the same HLS player as the students */}
            {lesson.hls_url && (
                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="p-0 sm:max-w-3xl">
                        <DialogTitle className="sr-only">{lesson.title}</DialogTitle>
                        {previewOpen && <VideoPlayer src={lesson.hls_url} title={lesson.title} poster={thumbnail} />}
                    </DialogContent>
                </Dialog>
            )}

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
