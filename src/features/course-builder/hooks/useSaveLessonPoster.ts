import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { saveLessonPosterService } from "../services/curriculum";

/**
 * Called by itself right after the picture is uploaded to Cloudinary: save it as the lesson poster.
 * The curriculum comes from the server (not React Query) → router.refresh() asks for it again.
 *
 *   saveLessonPoster({ lessonId, publicId }); // publicId = the name Cloudinary gave back after the upload
 */
export const useSaveLessonPoster = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: saveLessonPosterService,

        onSuccess: () => {
            toast.success("Poster saved");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't save the poster"));
        },
    });
};
