"use client"
import { addId, removeId, useOptimisticIdsMutation } from "@/hooks/useOptimisticIdsMutation";
import { wishlistQueryKey } from "@/features/wishlist/hooks/useWishlist";
import { addToCartService } from "../services/cart";
import { cartQueryKey } from "./useCart";

/**
 * Add a course to the cart — OPTIMISTIC:
 * the cart count goes up and the course leaves the wishlist right away
 * (the server removes it from the wishlist too); if it fails both lists go back.
 */
export const useAddToCart = () =>
    useOptimisticIdsMutation({
        mutationFn: (courseId: string) => addToCartService(courseId),
        updates: [
            { queryKey: cartQueryKey, update: (ids, courseId) => addId(ids, courseId) },
            { queryKey: wishlistQueryKey, update: (ids, courseId) => removeId(ids, courseId) },
        ],
        successMessage: "Added to cart",
        errorMessage: "Couldn't add to cart",
    });
