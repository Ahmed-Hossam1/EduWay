"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartQueryKey } from "@/features/cart/hooks/useCart";
import { wishlistQueryKey } from "@/features/wishlist/hooks/useWishlist";
import { enrollService } from "../services/enrollments";
import { enrollmentsQueryKey } from "./useEnrollments";

/**
 * "Enroll for free" — OPTIMISTIC:
 * the buttons switch to "Go to course" right away, and the course leaves the
 * cart + wishlist caches (the database trigger removes it there too).
 */
export const useEnroll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseId: string) => enrollService(courseId),

        onMutate: async (courseId) => {
            //cancel all the queries on that specific query keys ["enrollments", "cart", "wishlist"]
            // to not make wrong optimistic updates
            const keys = [enrollmentsQueryKey, cartQueryKey, wishlistQueryKey];
            await Promise.all(keys.map((queryKey) => queryClient.cancelQueries({ queryKey })));

            // keep the old lists to undo on error
            const previous = {
                enrollments: queryClient.getQueryData<string[]>(enrollmentsQueryKey),
                cart: queryClient.getQueryData<string[]>(cartQueryKey),
                wishlist: queryClient.getQueryData<string[]>(wishlistQueryKey),
            };

            queryClient.setQueryData<string[]>(enrollmentsQueryKey, (ids = []) =>
                ids.includes(courseId) ? ids : [courseId, ...ids]
            );
            queryClient.setQueryData<string[]>(cartQueryKey, (ids) => ids?.filter((id) => id !== courseId));
            queryClient.setQueryData<string[]>(wishlistQueryKey, (ids) => ids?.filter((id) => id !== courseId));

            return { previous };
        },

        onError: (_error, _courseId, context) => {
            queryClient.setQueryData(enrollmentsQueryKey, context?.previous.enrollments);
            queryClient.setQueryData(cartQueryKey, context?.previous.cart);
            queryClient.setQueryData(wishlistQueryKey, context?.previous.wishlist);
            toast.error("Couldn't enroll in this course");
        },

        onSuccess: () => toast.success("You're enrolled! Find the course in My courses"),

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: enrollmentsQueryKey });
            queryClient.invalidateQueries({ queryKey: cartQueryKey });
            queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
        },
    });
};
