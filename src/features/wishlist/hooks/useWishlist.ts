"use client"
import { useUserIdsQuery } from "@/hooks/useUserIdsQuery";
import { getWishlistIdsService } from "../services/wishlist";

export const wishlistQueryKey = ["wishlist"];

/**
 * The ids of the courses the user saved.
 * Used by the hearts (is this course saved?) and the Navbar count.
 */
export const useWishlist = () => useUserIdsQuery(wishlistQueryKey, getWishlistIdsService);
