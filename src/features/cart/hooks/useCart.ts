"use client"
import { useAppQuery } from "@/hooks/useAppQuery";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { getCartIdsService } from "../services/cart";

export const cartQueryKey = ["cart"];

/**
 * The ids of the courses in the user's cart.
 * Used by the "Add to cart / Go to cart" button and the Navbar count.
 * Guests don't send any request (enabled: false).
 */
export const useCart = () => {
    const { data: profile } = useProfile();

    return useAppQuery(cartQueryKey, getCartIdsService, {
        enabled: !!profile,
        staleTime: 5 * 60 * 1000,
    });
};
