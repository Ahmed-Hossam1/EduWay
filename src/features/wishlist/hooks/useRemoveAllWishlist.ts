"use client"
import { useOptimisticIdsMutation } from "@/hooks/useOptimisticIdsMutation";
import { removeAllFromWishlistService } from "../services/wishlist";
import { wishlistQueryKey } from "./useWishlist";

/**
 * "Remove all" on the wishlist page — OPTIMISTIC: the wishlist is empty right away.
 */
export const useRemoveAllWishlist = () =>
    useOptimisticIdsMutation({
        mutationFn: () => removeAllFromWishlistService(),
        updates: [{ queryKey: wishlistQueryKey, update: () => [] }],
        successMessage: "Removed all from wishlist",
        errorMessage: "Couldn't remove all from wishlist",
    });
