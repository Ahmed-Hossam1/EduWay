"use client"
import { useAppQuery } from "@/hooks/useAppQuery";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { getWishlistIdsService } from "../services/wishlist";

export const wishlistQueryKey = ["wishlist"];

/**
 * The ids of the courses the user saved.
 * Used by the hearts (is this course saved?) and the Navbar count.
 * Guests don't send any request (enabled: false) → no 401 in the console.
 */
export const useWishlist = () => {
    const { data: profile } = useProfile();

    return useAppQuery(wishlistQueryKey, getWishlistIdsService, {
        enabled: !!profile,       // only when logged in
        staleTime: 5 * 60 * 1000, // 5 minutes: the hearts don't refetch on every page
    });
};
