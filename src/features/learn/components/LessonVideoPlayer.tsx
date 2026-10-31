"use client";

import { Button } from "@/components/ui/button";
import { getVideoThumbnailUrl, getVideoUrl } from "@/lib/cloudinary/urls";
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/layouts/video.css';
import '@vidstack/react/player/styles/default/theme.css';
import { Lock, VideoOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
 *   a video     → the player; at 90% of the video the lesson is marked as done
 */
export function LessonVideoPlayer({ lesson, courseSlug, canSaveProgress }: LessonVideoPlayerProps) {
    const { mutate: completeLesson } = useCompleteLesson();
    // true after we asked the server once (timeupdate fires many times a second)
    const [videoCompleted, setVideoCompleted] = useState<boolean>(false);

    // check progress of the video if it reached the 90% mark then mark the lesson as completed
    // event.currentTarget = the <video> itself, read NOW (a ref read during render would still be null)
    // const checkProgress = (event: SyntheticEvent<HTMLVideoElement>) => {
    //     if (!canSaveProgress || lesson.is_completed || videoCompleted) return;

    //     const video = event.currentTarget;
    //     const isCompleted = (video.currentTime / video.duration) * 100 >= 90;

    //     if (isCompleted) {
    //         setVideoCompleted(true);
    //         completeLesson({ lessonId: lesson.id, completed: true });
    //     }
    // };


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

    const { title, video, id, description, can_watch, duration_seconds, is_preview, is_completed } = lesson;
    // 3- the video (the page gives this component key = the lesson → a new lesson = a new player from 0:00)
    return (
        <MediaPlayer
            title={lesson.title}
            src={getVideoUrl(video.public_id, video.version)}
            playsInline
            load="play"
        >
            <MediaProvider>
                <Poster src={getVideoThumbnailUrl(video.public_id, video.version)} className='vds-poster' />
            </MediaProvider>
            <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
    );
}
