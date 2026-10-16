import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { AUTH_MUTATION_KEY } from "../../shared/hooks/useIsAuthBusy";
import { loginService } from "../services/login";

/**
 * Email + password login:
 *   success → toast, then go where the server says (nextRoute: home, onboarding, waiting...)
 *   error   → toast with the server message
 *
 *   const { mutate: login, isPending } = useLogin();
 *   login({ email, password });
 */
export const useLogin = () => {
    const router = useRouter();

    return useMutation({
        mutationKey: AUTH_MUTATION_KEY, // → useIsAuthBusy() is true while it runs
        mutationFn: loginService,

        onSuccess: (response) => {
            toast.success("Login successful");
            // a short wait so the toast is seen before the page changes
            setTimeout(() => router.push(response.nextRoute), 300);
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Failed to login"));
        },
    });
};
