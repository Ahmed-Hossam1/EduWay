import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { retryLessonVideoHlsService } from "../services/curriculum";

/**
 * "Retry" on a video whose HLS copy failed: Cloudinary makes it again (the teacher doesn't upload again).
 * The curriculum comes from the server → router.refresh() shows "Preparing..." again.
 *
 *   retryLessonVideoHls(lesson.id);
 */
export const useRetryLessonVideoHls = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: retryLessonVideoHlsService,

        onSuccess: () => {
            toast.success("Preparing the video again");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't prepare the video"));
            router.refresh(); // "failed" again → the button stays
        },
    });
};
