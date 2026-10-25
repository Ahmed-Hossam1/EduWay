import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { addSectionService } from "../services/curriculum";

/**
 * "Add section" in the Curriculum tab (the new section goes to the end).
 * The curriculum comes from the server (not React Query) → router.refresh() asks for it again.
 *
 *   addSection({ courseId, title }, { onSuccess: closeForm });
 */
export const useAddSection = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: addSectionService,

        onSuccess: () => {
            toast.success("Section added");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't add the section"));
        },
    });
};
