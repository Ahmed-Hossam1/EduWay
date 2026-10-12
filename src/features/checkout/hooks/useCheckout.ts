import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { startCheckoutService } from "../services/checkout"

/**
 * "Checkout" button: asks the server for a Stripe payment page and goes there.
 */
export const useCheckout = () => {
    return useMutation({
        mutationFn: () => startCheckoutService(),
        onSuccess(url) {
            // Stripe is another website → a full page change (not router.push)
            window.location.href = url
        },
        onError(err) {
            console.error(err)
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<{ message: string }>
                toast.error(axiosError.response?.data?.message ?? "Failed to start the checkout")
            } else {
                toast.error("Something went wrong. Please try again.")
            }
        },
    })
}
