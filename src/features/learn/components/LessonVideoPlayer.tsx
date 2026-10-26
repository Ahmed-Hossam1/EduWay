"use client";

import Link from "next/link";
import { Lock, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVideoThumbnailUrl, getVideoUrl } from "@/lib/cloudinary/urls";
import { useCompleteLesson } from "../hooks/useCompleteLesson";
import { CurrentLesson } from "../types";
import { useRef, useState } from "react";

type LessonVideoPlayerProps = {
    lesson: CurrentLesson;
    courseSlug: string;
    canSaveProgress: boolean; // enrolled → the lesson is marked as done when the video ends
};

/**
 * The video of the open lesson (the browser player: play, seek, volume, full screen...).
 *   not allowed → a locked box + a link to the course page
 *   no video    → an empty box
 *   a video     → the player; at the end the lesson is marked as done
 */
export function LessonVideoPlayer({ lesson, courseSlug, canSaveProgress }: LessonVideoPlayerProps) {
    const { mutate: completeLesson } = useCompleteLesson();
    const [videoCompleted, setVideoCompleted] = useState<boolean>(false)

    const videoRef = useRef<HTMLVideoElement>(null)
    const video = videoRef.current

    // check progress of the video if it reached the 90% mark then mark the lesson as completed
    const check_progress = () => {
        if (!video || !canSaveProgress || videoCompleted) return;

        const currentTime = video.currentTime
        const duration = video.duration

        const isCompleted = (currentTime / duration) * 100 >= 90;

        if (isCompleted) {
            setVideoCompleted(true)
            completeLesson({ lessonId: lesson.id, completed: true })
        }

    }


    // 1- not enrolled and not a free preview
    if (!lesson.can_watch) {
        return (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl bg-muted px-4 text-center">
                <Lock className="size-8 text-muted-foreground" />
                <div>
                    <p className="font-semibold">This lesson is locked</p>
                    <p className="text-sm text-muted-foreground">Enroll in the course to watch every lesson.</p>
                </div>
                <Button asChild>
                    <Link href={`/courses/${courseSlug}`}>See the course</Link>
                </Button>
            </div>
        );
    }

    // 2- the teacher didn't upload a video yet
    if (!lesson.video) {
        return (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-muted text-muted-foreground">
                <VideoOff className="size-8" />
                <p className="text-sm">No video for this lesson yet</p>
            </div>
        );
    }

    // 3- the video (key = the lesson → a new lesson starts a new player from 0:00)
    return (
        <video
            key={lesson.id}
            ref={videoRef}
            src={getVideoUrl(lesson.video.public_id, lesson.video.version)}
            poster={getVideoThumbnailUrl(lesson.video.public_id, lesson.video.version)}
            controls
            playsInline
            className="aspect-video w-full rounded-xl bg-black"
            onTimeUpdate={check_progress}
        />
    );
}
