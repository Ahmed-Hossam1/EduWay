"use client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────
// Small helpers for updateCache: add / remove one id in a cached list of ids.
// They return a NEW array (never change the old one), so React Query sees the change.
//
// Use them inside updateCache:
//   updateCache: (oldIds, courseId) => addId(oldIds, courseId)
//   updateCache: (oldIds, courseId) => removeId(oldIds, courseId)
//
// Used in: useAddToCart, useRemoveFromCart, useToggleWishlist, useEnroll
// ─────────────────────────────────────────────────────────────────────

// Add the id at the START of the list, only once (no duplicates).
// The list is not loaded yet (undefined) → start from an empty list.
// addId(["b"], "a")        → ["a", "b"]
// addId(["a", "b"], "a")   → ["a", "b"]   (already there → same list)
// addId(undefined, "a")    → ["a"]
export const addId = (ids: string[] = [], id: string) => (ids.includes(id) ? ids : [id, ...ids]);

// Remove the id from the list.
// The list is not loaded yet (undefined) → stays undefined
// (returning [] would tell React Query "loaded and empty", and the Navbar would show 0).
// removeId(["a", "b"], "a")  → ["b"]
// removeId(["b"], "a")       → ["b"]   (not there → same items)
// removeId(undefined, "a")   → undefined
export const removeId = (ids: string[] | undefined, id: string) => ids?.filter((item) => item !== id);

type OptimisticMutationOptions<TVariables> = {
    mutationFn: (variables: TVariables) => Promise<unknown>;
    queryKeys: QueryKey[]; // the cached lists of ids this change touches (cart, wishlist...)
    // the new list for ONE cached list: called once for every queryKey
    updateCache: (oldIds: string[] | undefined, variables: TVariables, queryKey: QueryKey) => string[] | undefined;
    successMessage?: string; // not given => no success toast
    errorMessage: string;
};

/**
 * A reusable hook for optimistic updates on one or more cached lists of IDs.
 *
 * It updates the cache immediately (before the API request finishes),
 * restores the previous lists if the request fails, and refetch the
 * affected queries when the request is done (success or error).
 *
 * Options:
 * - mutationFn:     the API request to run. It receives what you pass to mutate().
 * - queryKeys:      the cached lists to update (cart, wishlist, enrollments...).
 * - updateCache:    returns the NEW list for one cached list. It is called once per queryKey with:
 *                     oldIds    → the list in the cache now (undefined if not loaded yet)
 *                     variables → what you passed to mutate() (usually a courseId)
 *                     queryKey  → which list is being updated (useful with several queryKeys)
 * - successMessage: optional toast when the request succeeds.
 * - errorMessage:   toast when the request fails.
 *
 * Run it:   const { mutate, isPending } = useOptimisticMutation({ ... })
 *           mutate(courseId)
 *
 * TVariables = the type of what you pass to mutate(): a courseId (the default),
 * an object, or void when mutate() takes nothing.
 *
 * ─────────────────────────────────────────────────────────────────────
 * Example 1 — REMOVE an id from one list
 *
 *   useOptimisticMutation({
 *     mutationFn: removeFromCartService,
 *     queryKeys: [cartQueryKey],
 *     updateCache: (oldIds, courseId) => removeId(oldIds, courseId),
 *     successMessage: "Removed from cart",
 *     errorMessage: "Couldn't remove from cart",
 *   });
 *
 *   ["a", "c1"]  →  ["a"]
 *
 * ─────────────────────────────────────────────────────────────────────
 * Example 2 — ADD an id to one list (at the start, only once)
 *
 *   useOptimisticMutation({
 *     mutationFn: addToWishlistService,
 *     queryKeys: [wishlistQueryKey],
 *     updateCache: (oldIds, courseId) => addId(oldIds, courseId),   // at the start, only once
 *     successMessage: "Added to wishlist",
 *     errorMessage: "Couldn't add to wishlist",
 *   });
 *
 *   ["a"]  →  ["c1", "a"]
 *
 * ─────────────────────────────────────────────────────────────────────
 * Example 3 — REMOVE ALL (mutate() takes nothing → <void>)
 *
 *   useOptimisticMutation<void>({
 *     mutationFn: removeAllFromCartService,
 *     queryKeys: [cartQueryKey],
 *     updateCache: () => [],
 *     successMessage: "Removed all from cart",
 *     errorMessage: "Couldn't remove all from cart",
 *   });
 *
 *   mutate()   →   ["a", "c1"]  →  []
 *
 * ─────────────────────────────────────────────────────────────────────
 * Example 4 — SEVERAL lists: add to one, remove from another
 * (updateCache runs once per queryKey → check queryKey to know which list it is)
 *
 *   useOptimisticMutation({
 *     mutationFn: addToCartService,
 *     queryKeys: [cartQueryKey, wishlistQueryKey],
 *     updateCache: (oldIds, courseId, queryKey) => {
 *       // the wishlist: the course leaves it
 *       if (queryKey === wishlistQueryKey) return removeId(oldIds, courseId);
 *
 *       // the cart: add the course
 *       return addId(oldIds, courseId);
 *     },
 *     successMessage: "Added to cart",
 *     errorMessage: "Couldn't add to cart",
 *   });
 *
 *   cart ["a"] → ["c1", "a"]      wishlist ["c1", "w"] → ["w"]
 *
 * ─────────────────────────────────────────────────────────────────────
 * Example 5 — an OBJECT in mutate() (add OR remove in the same hook)
 *
 *   type ToggleVariables = { courseId: string; isSaved: boolean };
 *
 *   useOptimisticMutation<ToggleVariables>({
 *     mutationFn: ({ courseId, isSaved }) =>
 *       isSaved ? removeFromWishlistService(courseId) : addToWishlistService(courseId),
 *     queryKeys: [wishlistQueryKey],
 *     updateCache: (oldIds, { courseId, isSaved }) => {
 *       if (isSaved) return removeId(oldIds, courseId);
 *       return addId(oldIds, courseId);
 *     },
 *     successMessage: "Wishlist updated",
 *     errorMessage: "Couldn't update your wishlist",
 *   });
 *
 *   mutate({ courseId: "c1", isSaved: true })   →   ["c1", "a"]  →  ["a"]
 */

export function useOptimisticMutation<TVariables = string>({
    mutationFn,
    queryKeys,
    updateCache,
    successMessage,
    errorMessage,
}: OptimisticMutationOptions<TVariables>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,

        // 1- before the request: change the lists right away
        onMutate: async (variables) => {
            // stop the running fetches of these lists, so they can't overwrite our change
            for (const queryKey of queryKeys) {
                await queryClient.cancelQueries({ queryKey });
            }

            // keep the old lists (same order as queryKeys), to undo if the request fails
            const previousLists = queryKeys.map((queryKey) => queryClient.getQueryData<string[]>(queryKey));

            // change every list with the function we got from outside
            for (const queryKey of queryKeys) {
                queryClient.setQueryData<string[]>(queryKey, (oldIds) => updateCache(oldIds, variables, queryKey));
            }

            return { previousLists };
        },

        // 2- the request failed: put every old list back
        onError: (_error, _variables, context) => {
            queryKeys.forEach((queryKey, index) => {
                queryClient.setQueryData(queryKey, context?.previousLists[index]);
            });
            toast.error(errorMessage);
        },

        onSuccess: () => {
            if (successMessage) toast.success(successMessage);
        },

        // 3- in the end: get the real lists from the database
        onSettled: () => {
            for (const queryKey of queryKeys) {
                queryClient.invalidateQueries({ queryKey });
            }
        },
    });
}
