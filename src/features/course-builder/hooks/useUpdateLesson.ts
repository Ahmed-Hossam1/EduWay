import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { updateLessonService } from "../services/curriculum";

/**
 * Save the lesson dialog (title, description, free preview).
 * The curriculum comes from the server (not React Query) → router.refresh() asks for it again.
 *
 *   updateLesson({ lessonId, values }, { onSuccess: closeDialog });
 */
export const useUpdateLesson = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: updateLessonService,

        onSuccess: () => {
            toast.success("Lesson saved");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't save the lesson"));
        },
    });
};
