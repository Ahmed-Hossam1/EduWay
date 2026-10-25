import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { saveLessonVideoService } from "../services/curriculum";

/**
 * After the upload to Cloudinary: save the video for the lesson (the server reads its duration).
 * The curriculum comes from the server (not React Query) → router.refresh() asks for it again.
 *
 *   saveLessonVideo({ lessonId, publicId }); // publicId = the name Cloudinary gave back after the upload
 */
export const useSaveLessonVideo = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: saveLessonVideoService,

        onSuccess: () => {
            toast.success("Video uploaded");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't save the video"));
        },
    });
};
