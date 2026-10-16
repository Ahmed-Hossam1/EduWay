"use client"
import { useUserIdsQuery } from "@/hooks/useUserIdsQuery";
import { getCartIdsService } from "../services/cart";

export const cartQueryKey = ["cart"];

/**
 * The ids of the courses in the user's cart.
 * Used by the "Add to cart / Go to cart" button and the Navbar count.
 */
export const useCart = () => useUserIdsQuery(cartQueryKey, getCartIdsService);
