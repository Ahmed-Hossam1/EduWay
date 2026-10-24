import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { deleteDraftCourseService } from "../services/courseActions";

/**
 * "Delete draft" in the course menu (same idea as useUnpublishCourse).
 *
 *   const { mutate: deleteDraft, isPending } = useDeleteDraftCourse();
 *   deleteDraft(course.id);
 */
export const useDeleteDraftCourse = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: deleteDraftCourseService,

        onSuccess: () => {
            toast.success("Draft deleted");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't delete the draft"));
        },
    });
};
