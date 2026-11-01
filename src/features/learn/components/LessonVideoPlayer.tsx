"use client";

import { useState } from "react";
import Link from "next/link";
import { type MediaTimeUpdateEvent, type MediaTimeUpdateEventDetail } from "@vidstack/react";
import { Loader2, Lock, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/shared/VideoPlayer";
import { useCompleteLesson } from "../hooks/useCompleteLesson";
import { CurrentLesson } from "../types";

type LessonVideoPlayerProps = {
    lesson: CurrentLesson;
    courseSlug: string;
    canSaveProgress: boolean; // enrolled → the lesson is marked as done when the video ends
};

/**
 * The video of the open lesson (the browser player: play, seek, volume, full screen...).
 *   not allowed → a locked box + a link to the course page
 *   no video    → an empty box
 *   not ready   → "being prepared" (the teacher just uploaded it, the HLS copy isn't made yet)
 *   a video     → the HLS player; at 95% of the video the lesson is marked as done
 */
export function LessonVideoPlayer({ lesson, courseSlug, canSaveProgress }: LessonVideoPlayerProps) {
    const { mutate: completeLesson } = useCompleteLesson();
    // true after we asked the server once (timeupdate fires many times a second)
    const [videoCompleted, setVideoCompleted] = useState<boolean>(false);

    // check progress of the video: at 95% the lesson is marked as completed
    // detail = { currentTime }, nativeEvent.target = the player (it knows the duration)
    const checkProgress = (detail: MediaTimeUpdateEventDetail, nativeEvent: MediaTimeUpdateEvent) => {
        if (!canSaveProgress || lesson.is_completed || videoCompleted) return;

        const duration = nativeEvent.target.state.duration;
        if (!duration) return; // not loaded yet → 0 → don't divide by 0

        const isCompleted = (detail.currentTime / duration) * 100 >= 95;

        if (isCompleted) {
            setVideoCompleted(true);
            completeLesson({ lessonId: lesson.id, completed: true });
        }
    };

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

    // 3- uploaded, but the HLS copy is not ready yet (or it failed: the teacher has to retry)
    if (!lesson.video.hls_url) {
        return (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-muted text-muted-foreground">
                <Loader2 className="size-8 animate-spin" />
                <p className="text-sm">This video is being prepared. Come back in a few minutes.</p>
            </div>
        );
    }

    // 4- the video (the page gives this component key = the lesson → a new lesson = a new player from 0:00)
    return (
        <VideoPlayer
            src={lesson.video.hls_url}
            title={lesson.title}
            poster={lesson.video.poster_url}
            onTimeUpdate={checkProgress}
        />
    );
}
