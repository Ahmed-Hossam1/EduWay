import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { forgotPasswordService } from "../services/forgotPassword";

/**
 * "Send reset link":
 *   success → the form shows "Check your inbox" (it reads isSuccess)
 *   error   → toast (e.g. "Too many requests. Please wait a minute...")
 *
 *   const { mutate: sendResetLink, isPending, isSuccess } = useForgotPassword();
 *   sendResetLink({ email });
 */
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPasswordService,

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't send the email. Please try again."));
        },
    });
};
