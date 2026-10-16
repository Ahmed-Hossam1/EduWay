"use client";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { removeAllFromWishlistService } from "../services/wishlist";
import { wishlistQueryKey } from "./useWishlist";

/**
 * "Remove all" on the wishlist page: the wishlist is empty right away.
 * <void> = mutate() takes nothing (no courseId).
 */
export const useRemoveAllWishlist = () =>
    useOptimisticMutation<void>({
        mutationFn: removeAllFromWishlistService,
        queryKeys: [wishlistQueryKey],
        updateCache: () => [],
        successMessage: "Removed all from wishlist",
        errorMessage: "Couldn't remove all from wishlist",
    });
