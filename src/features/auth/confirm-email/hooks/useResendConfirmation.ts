import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { resendConfirmationService } from "../services/resendConfirmation";

/**
 * "Send the confirmation email again":
 *   success → toast with the server message
 *   error   → toast (e.g. "Too many requests. Please wait a minute...")
 *
 *   const { mutate: resend, isPending } = useResendConfirmation();
 *   resend({ email });
 */
export const useResendConfirmation = () => {
    return useMutation({
        mutationFn: resendConfirmationService,

        onSuccess: (response) => {
            toast.success(response.message);
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't send the email. Please try again."));
        },
    });
};
