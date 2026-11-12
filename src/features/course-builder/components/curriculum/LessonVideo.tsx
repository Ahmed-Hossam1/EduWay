"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Play, RefreshCw, RotateCcw, Trash2, Upload, Video, X } from "lucide-react";
import { apiClient } from "@/lib/axios/apiClient";
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
import { LessonPoster } from "./LessonPoster";
import { getLessonVideoPublicId, getLessonVideoThumbnailUrl } from "../../utils";

type LessonVideoProps = {
    lesson: CurriculumLesson;
};

/**
 * The video box under a lesson:
 *   no video   → an empty box + "Upload video"
 *   uploading  → dark overlay fades out based on real upload progress + percentage label
 *   processing → "Preparing for streaming..." (Cloudinary makes the HLS copy; we check every 5 seconds)
 *   failed     → "Preparing failed" + "Retry" (no new upload)
 *   ready      → the preview (click → the HLS video in a window) + its length + "Replace" / "Remove"
 */
export function LessonVideo({ lesson }: LessonVideoProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const { mutateAsync: saveLessonVideo, isPending: isSaving } = useSaveLessonVideo();
    const { mutate: removeLessonVideo, isPending: isRemoving } = useRemoveLessonVideo();
    const { mutate: retryHls, isPending: isRetrying } = useRetryLessonVideoHls();

    // Real-time upload progress tracking
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);

    // Cancel ongoing upload only if the component unmounts
    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
}, []);

// while "processing": asks the server every 5 seconds, the page reloads when it is ready / failed
useLessonVideoHlsStatus(lesson.id, lesson.video_status);

const status = lesson.video_status; // null = no video
const isProcessing = status === "processing"; // Cloudinary is making the stream → Replace / Remove wait
const thumbnail = lesson.poster_url ?? getLessonVideoThumbnailUrl(lesson.id, lesson.video_version);

// the words under "Lesson video"
let subtitle = `${LESSON_VIDEO_FORMATS.join(", ").toUpperCase()} — up to ${MAX_VIDEO_SIZE / 1_000_000} MB`;
if (isUploading) subtitle = `Uploading: ${uploadProgress}%`;
else if (status === "ready") subtitle = `Length: ${formatVideoDuration(lesson.duration_seconds)}`;
else if (status === "processing") subtitle = "Preparing for streaming... This can take a few minutes.";
else if (status === "failed") subtitle = "Preparing the video failed. Retry, or upload it again.";

// Real-time direct upload to Cloudinary with byte-level progress
const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so the same file can be selected again if needed
    e.target.value = "";

    // 1- Validate format
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!LESSON_VIDEO_FORMATS.includes(extension)) {
        toast.error(`Please select a supported video format: ${LESSON_VIDEO_FORMATS.join(", ").toUpperCase()}`);
        return;
    }

    // 2- Validate size
    if (file.size > MAX_VIDEO_SIZE) {
        toast.error(`Video size exceeds ${MAX_VIDEO_SIZE / 1_000_000} MB limit`);
        return;
    }

    // 3- Reset progress and create local preview
    setUploadProgress(0);
    setIsUploading(true);
    const objectUrl = URL.createObjectURL(file);
    setUploadPreviewUrl(objectUrl);

    // 4- Setup abort controller for cancellation
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
        // 5- Request signature from backend
        const timestamp = Math.round(Date.now() / 1000);
        const publicId = getLessonVideoPublicId(lesson.id);

        const { signature } = await apiClient.post<{ signature: string }>(
            "/cloudinary/sign-lesson-upload",
            {
                paramsToSign: {
                    public_id: publicId,
                    timestamp,
                },
            },
        );

        // 6- Build FormData for Cloudinary signed upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
        formData.append("timestamp", String(timestamp));
        formData.append("public_id", publicId);
        formData.append("signature", signature);

        // 7- Upload with byte-level progress tracking
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const response = await axios.post<{ public_id: string }>(
            `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
            formData,
            {
                signal: controller.signal,
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setUploadProgress(percent);
                    }
                },
            },
        );

        // 8- Upload completed: transition from uploading to processing/saving
        setIsUploading(false);
        await saveLessonVideo({ lessonId: lesson.id, publicId: response.data.public_id });
    } catch (err: unknown) {
            if (axios.isCancel(err) || (err instanceof Error && (err.name === "CanceledError" || err.name === "AbortError"))) {
                toast.info("Upload cancelled");
            } else {
                console.error("Upload error:", err);
                let message = "Video upload failed. Please try again.";
                if (axios.isAxiosError(err)) {
                    message =
                        err.response?.data?.error?.message ||
                        err.response?.data?.message ||
                        err.message ||
                        message;
                } else if (err instanceof Error) {
                    message = err.message;
                }
                toast.error(message);
            }
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            setUploadPreviewUrl(null);
            abortControllerRef.current = null;
        }
    };

    const handleCancelUpload = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    return (
        <div className="mt-2 flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-3 sm:ml-9 sm:flex-row sm:items-center">
            {/* 1- the box: preview / uploading / preparing / failed / empty */}
            <div className="relative flex aspect-video w-full shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground sm:w-56">
                {isUploading ? (
                    <>
                        {/* Video preview underneath the overlay */}
                        {uploadPreviewUrl ? (
                            <video
                                src={uploadPreviewUrl}
                                className="size-full object-cover"
                                muted
                                playsInline
                            />
                        ) : thumbnail ? (
                            <Image src={thumbnail} alt="" fill sizes="224px" className="object-cover" />
                        ) : (
                            <Video className="size-8 text-muted-foreground/40" />
                        )}

                        {/* Dark overlay: dynamically fades out as progress increases: opacity = 0.8 * (1 - progress / 100) */}
                        <div
                            style={{ opacity: 0.8 * (1 - uploadProgress / 100) }}
                            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black px-3 text-center text-white transition-opacity duration-200 ease-out pointer-events-none"
                        >
                            <Loader2 className="size-5 animate-spin" />
                            <span className="text-sm font-bold tracking-tight">{uploadProgress}%</span>
                            <span className="text-[11px] font-medium text-white/90">
                                {uploadProgress === 100 ? "Finalizing upload..." : "Uploading video..."}
                            </span>
                        </div>

                        {/* Bottom progress track */}
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                            <div
                                className="h-full bg-primary transition-all duration-150 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </>
                ) : status === "ready" && lesson.hls_url ? (
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
                ) : status === "processing" ? (
                    <>
                        {/* a blurred frame of the uploaded video behind (Cloudinary makes it from the MP4) */}
                        <Image src={thumbnail} alt="" fill sizes="224px" className="scale-110 object-cover blur-sm" />
                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 px-3 text-center text-white">
                            <Loader2 className="size-6 animate-spin" />
                            <span className="text-xs font-medium">Preparing the stream...</span>
                        </span>
                        {/* a moving bar at the bottom → "still working" */}
                        <span className="absolute inset-x-0 bottom-0 h-1 animate-pulse bg-primary" />
                    </>
                ) : status === "failed" ? (
                    <AlertTriangle className="size-6 text-destructive" />
                ) : (
                    <Video className="size-6" />
                )}
            </div>

            {/* 2- what it is + its buttons */}
            <div className="min-w-0 flex-1 space-y-2">
                <div>
                    <p className="text-sm font-semibold">{status ? "Lesson video" : "No video yet"}</p>
                    <p className={status === "failed" ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
                        {subtitle}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {status === "failed" && !isUploading && (
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

                    {/* Hidden file input triggered by the button */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={LESSON_VIDEO_FORMATS.map((format) => `.${format}`).join(",")}
                        className="hidden"
                        onChange={handleFileSelect}
                    />

                    <Button
                        type="button"
                        variant={status ? "outline" : "default"}
                        size="sm"
                        disabled={isProcessing || isSaving}
                        isLoading={isUploading || isSaving}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {isUploading ? (
                            `Uploading (${uploadProgress}%)`
                        ) : isSaving ? (
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

                    {isUploading && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelUpload}
                            className="gap-1 text-xs text-muted-foreground hover:text-destructive"
                        >
                            <X className="size-3.5" />
                            Cancel
                        </Button>
                    )}

                    {status && !isUploading && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => setConfirmOpen(true)}
                        >
                            <Trash2 />
                            Remove video
                        </Button>
                    )}
                </div>

                {/* the poster belongs to the video → only when there is a video (it waits while "processing") */}
                {(status === "processing" || status === "ready") && <LessonPoster lesson={lesson} />}
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
