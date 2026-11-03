import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { removeLessonPosterService } from "../services/curriculum";

/**
 * Remove the poster of a lesson (the database + the file on Cloudinary). The video stays.
 * The curriculum comes from the server (not React Query) → router.refresh() asks for it again.
 *
 *   removeLessonPoster(lessonId);
 */
export const useRemoveLessonPoster = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: removeLessonPosterService,

        onSuccess: () => {
            toast.success("Poster removed");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't remove the poster"));
        },
    });
};
