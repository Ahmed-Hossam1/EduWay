"use client";
import { removeId, useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { removeFromCartService } from "../services/cart";
import { cartQueryKey } from "./useCart";

type RemoveOptions = {
    silent?: boolean; // "Move to wishlist" shows its own message
};

/**
 * Remove a course from the cart: it disappears from the cart page and the count goes down right away.
 */
export const useRemoveFromCart = ({ silent = false }: RemoveOptions = {}) =>
    useOptimisticMutation({
        mutationFn: removeFromCartService,
        queryKeys: [cartQueryKey],
        // every course except this one
        updateCache: (oldIds, courseId) => removeId(oldIds, courseId),
        successMessage: silent ? undefined : "Removed from cart",
        errorMessage: "Couldn't remove from cart",
    });
