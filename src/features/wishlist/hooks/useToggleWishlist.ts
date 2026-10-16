"use client";
import { addId, removeId, useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { addToWishlistService, removeFromWishlistService } from "../services/wishlist";
import { wishlistQueryKey } from "./useWishlist";

type ToggleVariables = {
    courseId: string;
    isSaved: boolean; // the state BEFORE the click → saved = remove, not saved = add
};

/**
 * The heart: add or remove a course — the heart changes right away.
 *
 *   const { mutate: toggleWishlist, isPending } = useToggleWishlist()
 *   toggleWishlist({ courseId, isSaved })
 */
export const useToggleWishlist = () =>
    useOptimisticMutation<ToggleVariables>({
        mutationFn: ({ courseId, isSaved }) =>
            isSaved ? removeFromWishlistService(courseId) : addToWishlistService(courseId),
        queryKeys: [wishlistQueryKey],
        updateCache: (oldIds, { courseId, isSaved }) => {
            // saved → remove it
            if (isSaved) return removeId(oldIds, courseId);

            // not saved → add it
            return addId(oldIds, courseId);
        },
        // one message for both (add / remove): the heart itself shows what happened
        successMessage: "Wishlist updated",
        errorMessage: "Couldn't update your wishlist",
    });
