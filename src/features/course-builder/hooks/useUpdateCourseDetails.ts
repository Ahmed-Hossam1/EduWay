import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { updateCourseDetailsService } from "../services/courseBuilder";

/**
 * "Save" on the Details tab.
 * The edit page comes from the server (not React Query) → router.refresh() asks for it again,
 * so the header title and the publish checklist update.
 *
 *   const { mutate: saveDetails, isPending } = useUpdateCourseDetails();
 *   saveDetails({ courseId, values });
 */
export const useUpdateCourseDetails = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: updateCourseDetailsService,

        onSuccess: () => {
            toast.success("Details saved");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't save the details"));
        },
    });
};
