"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addToWishlistService, removeFromWishlistService } from "../services/wishlist";
import { wishlistQueryKey } from "./useWishlist";

type ToggleVariables = {
    courseId: string;
    isSaved: boolean; // the state BEFORE the click → saved = remove, not saved = add
};

/**
 * Add / remove a course with an OPTIMISTIC UPDATE:
 *   1- the heart changes right away (we edit the cache before the request)
 *   2- the request goes to the server in the background
 *   3- if it fails → put the old cache back + show an error
 */
export const useToggleWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, isSaved }: ToggleVariables) =>
            isSaved ? removeFromWishlistService(courseId) : addToWishlistService(courseId),

        // 1- before the request: update the cache right away
        onMutate: async ({ courseId, isSaved }) => {
            // stop a running fetch so it can't overwrite our change
            await queryClient.cancelQueries({ queryKey: wishlistQueryKey });

            // keep the old list, to undo if the request fails
            const previousIds = queryClient.getQueryData<string[]>(wishlistQueryKey);

            queryClient.setQueryData<string[]>(wishlistQueryKey, (ids = []) =>
                isSaved ? ids.filter((id) => id !== courseId) : [courseId, ...ids]
            );

            return { previousIds };
        },

        // 3- the request failed: undo
        onError: (_error, { isSaved }, context) => {
            queryClient.setQueryData(wishlistQueryKey, context?.previousIds);
            toast.error(isSaved ? "Couldn't remove from wishlist" : "Couldn't add to wishlist");
        },

        onSuccess: (_data, { isSaved }) => {
            toast.success(isSaved ? "Removed from wishlist" : "Added to wishlist");
        },

        // in the end, make sure the cache matches the database
        onSettled: () => queryClient.invalidateQueries({ queryKey: wishlistQueryKey }),
    });
};
