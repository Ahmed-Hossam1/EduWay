import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { cartQueryKey } from "@/features/cart/hooks/useCart";
import { wishlistQueryKey } from "@/features/wishlist/hooks/useWishlist";
import { enrollmentsQueryKey } from "@/features/enrollments/hooks/useEnrollments";
import { logoutService } from "../services/logout";
import { profileQueryKey } from "./useProfile";

/**
 * "Log out" in the menus:
 *   right away → the menu shows a guest (profile = null) and the user's lists leave the cache
 *   success    → a full page reload to "/" (every cache and server component starts clean)
 *   error      → the profile comes back + a toast
 */
export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutService,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: profileQueryKey });
            const prevProfile = queryClient.getQueryData(profileQueryKey);
            queryClient.setQueryData(profileQueryKey, null);
            queryClient.removeQueries({ queryKey: wishlistQueryKey });
            queryClient.removeQueries({ queryKey: cartQueryKey });
            queryClient.removeQueries({ queryKey: enrollmentsQueryKey });

            return { prevProfile };
        },
        onError: (error, _variables, context) => {
            // _ = not used
            queryClient.setQueryData(profileQueryKey, context?.prevProfile);
            toast.error(getErrorMessage(error, "Couldn't log out. Please try again."));
        },
        onSuccess: () => {
            // a full page reload on purpose: every cache and every server component starts clean after logout
            // (router.push would keep the old React Query cache and server data in memory)
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.assign("/");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: profileQueryKey });
        },
    });
};
