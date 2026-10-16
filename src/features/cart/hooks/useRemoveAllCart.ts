"use client"
import { useOptimisticIdsMutation } from "@/hooks/useOptimisticIdsMutation";
import { RemoveAllCart } from "../services/cart";
import { cartQueryKey } from "./useCart";

/**
 * "Remove all" on the cart page — OPTIMISTIC: the cart is empty right away.
 */
export const useRemoveAllCart = () =>
    useOptimisticIdsMutation({
        mutationFn: () => RemoveAllCart(),
        updates: [{ queryKey: cartQueryKey, update: () => [] }],
        successMessage: "Removed all from cart",
        errorMessage: "Couldn't remove all from cart",
    });
