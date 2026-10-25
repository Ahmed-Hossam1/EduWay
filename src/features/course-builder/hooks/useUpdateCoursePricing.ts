import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { updateCoursePricingService } from "../services/courseBuilder";

/**
 * "Save" on the Pricing tab (same idea as useUpdateCourseDetails).
 *
 *   const { mutate: savePricing, isPending } = useUpdateCoursePricing();
 *   savePricing({ courseId, values });
 */
export const useUpdateCoursePricing = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: updateCoursePricingService,

        onSuccess: () => {
            toast.success("Price saved");
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't save the price"));
        },
    });
};
