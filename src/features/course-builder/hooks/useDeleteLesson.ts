import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { deleteLessonService } from "../services/curriculum";

/**
 * Delete a lesson.
 * The curriculum comes from the server (not React Query) → router.refresh() asks for it again.
 *
 *   deleteLesson(lessonId);
 */
export const useDeleteLesson = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: deleteLessonService,

        onSuccess: () => {
            toast.success("Lesson deleted");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't delete the lesson"));
        },
    });
};
