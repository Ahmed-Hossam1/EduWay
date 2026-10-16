import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { AUTH_MUTATION_KEY } from "../../shared/hooks/useIsAuthBusy";
import { signupService } from "../services/signup";

/**
 * Create an account (email + password):
 *   success → toast, then go where the server says (nextRoute: usually choose-role)
 *   error   → toast with the server message (e.g. "An account with this email already exists")
 *
 *   const { mutate: signup, isPending } = useSignup();
 *   signup(formValues);
 */
export const useSignup = () => {
    const router = useRouter();

    return useMutation({
        mutationKey: AUTH_MUTATION_KEY, // → useIsAuthBusy() is true while it runs
        mutationFn: signupService,

        onSuccess: (response) => {
            toast.success("Account created successfully");
            // a short wait so the toast is seen before the page changes
            setTimeout(() => router.push(response.nextRoute), 400);
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Failed to create account"));
        },
    });
};
