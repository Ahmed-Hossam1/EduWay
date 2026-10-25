import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { removeLessonVideoService } from "../services/curriculum";

/**
 * Remove the video of a lesson (the database row + the file on Cloudinary).
 * The curriculum comes from the server (not React Query) → router.refresh() asks for it again.
 *
 *   removeLessonVideo(lessonId, { onSuccess: closeDialog });
 */
export const useRemoveLessonVideo = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: removeLessonVideoService,

        onSuccess: () => {
            toast.success("Video removed");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't remove the video"));
        },
    });
};
