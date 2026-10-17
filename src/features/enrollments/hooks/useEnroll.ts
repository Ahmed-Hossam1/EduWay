"use client";
import { addId, removeId, useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { cartQueryKey } from "@/features/cart/hooks/useCart";
import { wishlistQueryKey } from "@/features/wishlist/hooks/useWishlist";
import { enrollService } from "../services/enrollments";
import { enrollmentsQueryKey } from "./useEnrollments";

/**
 * "Enroll for free" — 3 lists change right away:
 * the buttons switch to "Go to course", and the course leaves the cart + wishlist
 * (the database trigger removes it there too).
 */
export const useEnroll = () =>
    useOptimisticMutation({
        mutationFn: enrollService,
        queryKeys: [enrollmentsQueryKey, cartQueryKey, wishlistQueryKey],
        updateCache: (oldIds, courseId, queryKey) => {
            // the enrollments: add the course at the start (only once)
            if (queryKey === enrollmentsQueryKey) return addId(oldIds, courseId);

            // the cart and the wishlist: the course leaves them
            return removeId(oldIds, courseId);
        },
        successMessage: "You're enrolled! Find the course in My courses",
        errorMessage: "Couldn't enroll in this course",
    });
