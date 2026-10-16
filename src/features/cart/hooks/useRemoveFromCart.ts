"use client"
import { removeId, useOptimisticIdsMutation } from "@/hooks/useOptimisticIdsMutation";
import { removeFromCartService } from "../services/cart";
import { cartQueryKey } from "./useCart";

type RemoveOptions = {
    silent?: boolean; // "Move to wishlist" shows its own message
};

/**
 * Remove a course from the cart — OPTIMISTIC:
 * the course disappears from the cart page and the count goes down right away.
 */
export const useRemoveFromCart = ({ silent = false }: RemoveOptions = {}) =>
    useOptimisticIdsMutation({
        mutationFn: (courseId: string) => removeFromCartService(courseId),
        updates: [{ queryKey: cartQueryKey, update: (ids, courseId) => removeId(ids, courseId) }],
        successMessage: silent ? undefined : "Removed from cart",
        errorMessage: "Couldn't remove from cart",
    });
