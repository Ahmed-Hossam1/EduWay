"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wishlistQueryKey } from "@/features/wishlist/hooks/useWishlist";
import { addToCartService } from "../services/cart";
import { cartQueryKey } from "./useCart";

/**
 * Add a course to the cart — OPTIMISTIC:
 * the cart count goes up and the course leaves the wishlist right away,
 * then the request runs; if it fails both caches go back.
 */
export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseId: string) => addToCartService(courseId),

        onMutate: async (courseId) => {
            await queryClient.cancelQueries({ queryKey: cartQueryKey });
            await queryClient.cancelQueries({ queryKey: wishlistQueryKey });

            // keep the old lists to undo on error
            const previousCart = queryClient.getQueryData<string[]>(cartQueryKey);
            const previousWishlist = queryClient.getQueryData<string[]>(wishlistQueryKey);

            // add to the cart
            queryClient.setQueryData<string[]>(cartQueryKey, (ids = []) =>
                ids.includes(courseId) ? ids : [courseId, ...ids]
            );
            // the server removes it from the wishlist → do the same in the cache
            queryClient.setQueryData<string[]>(wishlistQueryKey, (ids) => ids?.filter((id) => id !== courseId));

            return { previousCart, previousWishlist };
        },

        onError: (_error, _courseId, context) => {
            queryClient.setQueryData(cartQueryKey, context?.previousCart);
            queryClient.setQueryData(wishlistQueryKey, context?.previousWishlist);
            toast.error("Couldn't add to cart");
        },

        onSuccess: () => toast.success("Added to cart"),

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: cartQueryKey });
            queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
        },
    });
};
