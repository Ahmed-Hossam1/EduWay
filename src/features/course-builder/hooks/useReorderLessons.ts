import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { reorderLessonsService } from "../services/curriculum";

/**
 * Save the order of the lessons of one section after a drag.
 * The list moves on the screen right away; this only saves the new order.
 * Failed → the component puts the old order back (mutate(..., { onError })) + this toast.
 *
 *   reorderLessons({ sectionId, ids }, { onError: () => setSections(oldSections) });
 */
export const useReorderLessons = () => {
    return useMutation({
        mutationFn: reorderLessonsService,

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't save the new order"));
        },
    });
};
