import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { resetPasswordService } from "../services/resetPassword";

/**
 * "Update password":
 *   success → toast, then the login page (the server logged him out → he signs in with the new password)
 *   error   → toast (e.g. "Your new password must be different from the old one.")
 *
 *   const { mutate: resetPassword, isPending } = useResetPassword();
 *   resetPassword({ password, confirmPassword });
 */
export const useResetPassword = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: resetPasswordService,

        onSuccess: (response) => {
            toast.success("Password updated. Sign in with your new password.");
            router.push(response.nextRoute);
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't update your password. Please try again."));
        },
    });
};
