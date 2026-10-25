import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { renameSectionService } from "../services/curriculum";

/**
 * Rename a section.
 * The curriculum comes from the server (not React Query) → router.refresh() asks for it again.
 *
 *   renameSection({ sectionId, title }, { onSuccess: closeForm });
 */
export const useRenameSection = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: renameSectionService,

        onSuccess: () => {
            toast.success("Section renamed");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't rename the section"));
        },
    });
};
