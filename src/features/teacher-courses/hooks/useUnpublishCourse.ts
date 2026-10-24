import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { unpublishCourseService } from "../services/courseActions";

/**
 * "Unpublish" in the course menu.
 * The list comes from the server (not React Query) → router.refresh() asks the server for it again.
 *
 *   const { mutate: unpublish, isPending } = useUnpublishCourse();
 *   unpublish(course.id);
 */
export const useUnpublishCourse = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: unpublishCourseService,

        onSuccess: () => {
            toast.success("Course unpublished");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't unpublish the course"));
        },
    });
};
