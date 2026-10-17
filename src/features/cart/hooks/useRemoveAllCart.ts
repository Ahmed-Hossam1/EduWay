"use client";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { removeAllFromCartService } from "../services/cart";
import { cartQueryKey } from "./useCart";

/**
 * "Remove all" on the cart page: the cart is empty right away.
 * <void> = mutate() takes nothing (no courseId).
 */
export const useRemoveAllCart = () =>
    useOptimisticMutation<void>({
        mutationFn: removeAllFromCartService,
        queryKeys: [cartQueryKey],
        updateCache: () => [],
        successMessage: "Removed all from cart",
        errorMessage: "Couldn't remove all from cart",
    });
