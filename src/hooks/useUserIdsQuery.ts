"use client";
import { QueryKey } from "@tanstack/react-query";
import { useAppQuery } from "@/hooks/useAppQuery";
import { useProfile } from "@/features/profile/hooks/useProfile";

/**
 * A list of course ids that belongs to the logged-in user
 * (cart, wishlist, enrollments...).
 *
 *   export const useCart = () => useUserIdsQuery(cartQueryKey, getCartIdsService)
 *
 * - guests don't send any request (enabled: false) → no 401 in the console
 * - staleTime 5 minutes: the Navbar counts / buttons don't refetch on every page
 */
export const useUserIdsQuery = (queryKey: QueryKey, queryFn: () => Promise<string[]>) => {
    const { data: profile } = useProfile();

    return useAppQuery(queryKey, queryFn, {
        enabled: !!profile,
        staleTime: 5 * 60 * 1000,
    });
};
