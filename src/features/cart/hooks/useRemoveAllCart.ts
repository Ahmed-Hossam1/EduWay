import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cartQueryKey } from "./useCart"
import { toast } from "sonner"
import { RemoveAllCart } from "../services/cart"

export const useRemoveAllCart = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => RemoveAllCart(),
        async onMutate() {
            await queryClient.cancelQueries({ queryKey: cartQueryKey })
            const previous = queryClient.getQueryData(cartQueryKey)
            queryClient.setQueryData(cartQueryKey, [])
            return { previous }
        },
        onError(err, vars, context) {
            queryClient.setQueryData(cartQueryKey, context?.previous)
            toast.error("failed to remove all from cart")
        },
        onSuccess() {
            toast.success("removed all from cart")
        },
        onSettled() {
            queryClient.invalidateQueries({ queryKey: cartQueryKey })
        }

    })
}

