import { Mutation, useMutation, useQueryClient } from "@tanstack/react-query"
import { removeAllFromWishlistService } from "../services/wishlist"
import { wishlistQueryKey } from "./useWishlist"
import { toast } from "sonner"

export const useRemoveAllWishlist = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => removeAllFromWishlistService(),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: wishlistQueryKey })
            const previous = queryClient.getQueryData(wishlistQueryKey)
            queryClient.setQueryData(wishlistQueryKey, [])
            return { previous }
        },
        onError: (error, _variables, context) => {
            queryClient.setQueryData(wishlistQueryKey, context?.previous)
            toast.error("failed to remove all ")
        },
        onSuccess: () => toast.success("removed all from wishlist "),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: wishlistQueryKey })
        }
    })
}