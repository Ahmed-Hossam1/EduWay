import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { VideoStatus } from "@/features/courses/types";
import { getLessonVideoHlsStatusService } from "../services/curriculum";

const FIVE_SECONDS = 5 * 1000;

/**
 * While a lesson video is "processing": ask every 5 seconds "is the HLS ready?".
 * The answer changes (ready / failed) → router.refresh() → the Curriculum shows the new state
 * (the page comes from the server, not React Query).
 * The webhook usually makes it ready first; this is the backup (e.g. localhost without a tunnel).
 *
 *   useLessonVideoHlsStatus(lesson.id, lesson.video_status);
 */
export const useLessonVideoHlsStatus = (lessonId: string, status: VideoStatus | null) => {
    const router = useRouter();
    const isProcessing = status === "processing";

    const { data } = useQuery({
        queryKey: ["lesson-video-hls", lessonId],
        queryFn: () => getLessonVideoHlsStatusService(lessonId),
        enabled: isProcessing, // only while it is being prepared
        refetchInterval: FIVE_SECONDS,
        staleTime: 0,
    });

    // the server says it is not processing anymore → load the page again (once: then isProcessing is false)
    useEffect(() => {
        if (isProcessing && data && data.status !== "processing") {
            router.refresh();
        }
    }, [isProcessing, data, router]);
};
