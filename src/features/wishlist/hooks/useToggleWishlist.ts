"use client"
import { addId, removeId, useOptimisticIdsMutation } from "@/hooks/useOptimisticIdsMutation";
import { addToWishlistService, removeFromWishlistService } from "../services/wishlist";
import { wishlistQueryKey } from "./useWishlist";

type ToggleVariables = {
    courseId: string;
    isSaved: boolean; // the state BEFORE the click → saved = remove, not saved = add
};

/**
 * The heart: add / remove a course — OPTIMISTIC: the heart changes right away.
 */
export const useToggleWishlist = () =>
    useOptimisticIdsMutation({
        mutationFn: ({ courseId, isSaved }: ToggleVariables) =>
            isSaved ? removeFromWishlistService(courseId) : addToWishlistService(courseId),
        updates: [
            {
                queryKey: wishlistQueryKey,
                update: (ids, { courseId, isSaved }) => (isSaved ? removeId(ids, courseId) : addId(ids, courseId)),
            },
        ],
        // the text depends on what was clicked
        successMessage: ({ isSaved }) => (isSaved ? "Removed from wishlist" : "Added to wishlist"),
        errorMessage: ({ isSaved }) => (isSaved ? "Couldn't remove from wishlist" : "Couldn't add to wishlist"),
    });
