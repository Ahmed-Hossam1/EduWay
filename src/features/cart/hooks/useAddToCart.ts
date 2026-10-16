"use client"
import { addId, removeId, useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { wishlistQueryKey } from "@/features/wishlist/hooks/useWishlist";
import { addToCartService } from "../services/cart";
import { cartQueryKey } from "./useCart";

/**
 * Add a course to the cart — 2 lists change right away:
 * the cart count goes up AND the course leaves the wishlist (the server removes it there too).
 */
export const useAddToCart = () =>
    useOptimisticMutation({
        mutationFn: addToCartService,
        queryKeys: [cartQueryKey, wishlistQueryKey],
        updateCache: (oldIds, courseId, queryKey) => {
            // the wishlist: the course leaves it
            if (queryKey === wishlistQueryKey) return removeId(oldIds, courseId);

            // the cart: add the course
            return addId(oldIds, courseId);
        },
        successMessage: "Added to cart",
        errorMessage: "Couldn't add to cart",
    });
