import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { addLessonService } from "../services/curriculum";

/**
 * "Add lesson" in a section (the new lesson goes to the end of the section).
 * The curriculum comes from the server (not React Query) → router.refresh() asks for it again.
 *
 *   addLesson({ sectionId, title }, { onSuccess: closeForm });
 */
export const useAddLesson = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: addLessonService,

        onSuccess: () => {
            toast.success("Lesson added");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't add the lesson"));
        },
    });
};
