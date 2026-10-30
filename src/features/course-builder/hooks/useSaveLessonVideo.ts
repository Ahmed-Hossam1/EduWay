import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { saveLessonVideoService } from "../services/curriculum";

/**
 * Called by itself right after the upload to Cloudinary: save the video for the lesson
 * (the server reads its duration) + the server starts its HLS copy → "Preparing..." in the Curriculum.
 * The curriculum comes from the server (not React Query) → router.refresh() asks for it again.
 *
 *   saveLessonVideo({ lessonId, publicId }); // publicId = the name Cloudinary gave back after the upload
 */
export const useSaveLessonVideo = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: saveLessonVideoService,

        onSuccess: () => {
            toast.success("Video uploaded. Preparing it for streaming...");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't save the video"));
            // uploaded but preparing failed → saved as "failed" → show its "Retry" button
            router.refresh();
        },
    });
};
