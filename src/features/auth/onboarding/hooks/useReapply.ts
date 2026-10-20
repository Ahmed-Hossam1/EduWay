import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { reapplyService } from "../services/reapply";

/**
 * "Try again" on /account/rejected:
 *   success → the profile status changed (the Navbar badge too) → open the onboarding
 *   error   → toast
 *
 *   const { mutate: reapply, isPending } = useReapply();
 */
export const useReapply = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reapplyService,

        onSuccess: (response) => {
            // status rejected → onboarding: the menu badge must show it
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            router.push(response.nextRoute);
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Something went wrong. Please try again."));
        },
    });
};
