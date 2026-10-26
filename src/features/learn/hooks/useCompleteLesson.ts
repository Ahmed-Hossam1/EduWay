import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { completeLessonService } from "../services/learn";

/**
 * "Mark as complete" (and when the video ends).
 * The player page comes from the server (not React Query) → router.refresh() asks for it again,
 * so the ✓ in the curriculum and the progress bar update.
 *
 *   completeLesson({ lessonId, completed: true });
 */
export const useCompleteLesson = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: completeLessonService,

        onSuccess: (result) => {
            if (result.courseCompleted) toast.success("Congratulations! You finished the course 🎉");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't save your progress"));
        },
    });
};
