import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { toast } from "sonner";
import { startCheckoutService } from "../services/checkout";

/**
 * "Checkout" button: asks the server for a Stripe payment page and goes there.
 */
export const useCheckout = () => {
    return useMutation({
        mutationFn: () => startCheckoutService(),
        onSuccess(url) {
            // Stripe is another website → a full page change (not router.push)
            window.location.href = url;
        },
        onError(err) {
            console.error(err);
            toast.error(getErrorMessage(err, "Failed to start the checkout"));
        },
    });
};
