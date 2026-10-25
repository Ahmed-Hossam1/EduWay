import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { deleteSectionService } from "../services/curriculum";

/**
 * Delete a section and its lessons.
 * The curriculum comes from the server (not React Query) → router.refresh() asks for it again.
 *
 *   deleteSection(sectionId);
 */
export const useDeleteSection = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: deleteSectionService,

        onSuccess: () => {
            toast.success("Section deleted");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't delete the section"));
        },
    });
};
