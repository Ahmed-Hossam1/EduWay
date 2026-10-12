"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeFromCartService } from "../services/cart";
import { cartQueryKey } from "./useCart";

type RemoveOptions = {
    silent?: boolean; // "Move to wishlist" shows its own message
};

/**
 * Remove a course from the cart — OPTIMISTIC:
 * the course disappears from the cart page and the count goes down right away.
 */
export const useRemoveFromCart = ({ silent = false }: RemoveOptions = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseId: string) => removeFromCartService(courseId),

        onMutate: async (courseId) => {
            await queryClient.cancelQueries({ queryKey: cartQueryKey });
            const previousCart = queryClient.getQueryData<string[]>(cartQueryKey);

            queryClient.setQueryData<string[]>(cartQueryKey, (ids = []) => ids.filter((id) => id !== courseId));

            return { previousCart };
        },

        onError: (_error, _courseId, context) => {
            queryClient.setQueryData(cartQueryKey, context?.previousCart);
            toast.error("Couldn't remove from cart");
        },

        onSuccess: () => {
            if (!silent) toast.success("Removed from cart");
        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: cartQueryKey }),
    });
};
