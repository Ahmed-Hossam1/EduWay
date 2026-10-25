import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { reorderSectionsService } from "../services/curriculum";

/**
 * Save the order of the sections after a drag.
 * The list moves on the screen right away; this only saves the new order.
 * Failed → the component puts the old order back (mutate(..., { onError })) + this toast.
 *
 *   reorderSections({ courseId, ids }, { onError: () => setSections(oldSections) });
 */
export const useReorderSections = () => {
    return useMutation({
        mutationFn: reorderSectionsService,

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't save the new order"));
        },
    });
};
