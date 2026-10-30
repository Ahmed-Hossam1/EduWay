"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import { cn } from "@/lib/utils";

type VideoPlayerProps = {
    src: string; // the HLS link (.m3u8) — never the uploaded MP4
    title: string;
    poster?: string | null; // the picture before playing
    className?: string;
};

/**
 * The ONE video player of the app (Vidstack): play, seek, quality, speed, full screen, keyboard...
 * It plays HLS (.m3u8): many qualities, the player picks the one that fits the internet speed.
 * Used by the Curriculum preview (teacher) and the lesson player (students).
 *
 *   <VideoPlayer src={lesson.hls_url} title={lesson.title} poster={lesson.poster_url} />
 */
export function VideoPlayer({ src, title, poster, className }: VideoPlayerProps) {
    return (
        <MediaPlayer
            title={title}
            src={src}
            playsInline
            className={cn("aspect-video w-full overflow-hidden rounded-xl bg-black", className)}
        >
            <MediaProvider>{poster && <Poster src={poster} alt={title} className="vds-poster" />}</MediaProvider>
            <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
    );
}
