"use client"
import { addId, removeId, useOptimisticIdsMutation } from "@/hooks/useOptimisticIdsMutation";
import { cartQueryKey } from "@/features/cart/hooks/useCart";
import { wishlistQueryKey } from "@/features/wishlist/hooks/useWishlist";
import { enrollService } from "../services/enrollments";
import { enrollmentsQueryKey } from "./useEnrollments";

/**
 * "Enroll for free" — OPTIMISTIC:
 * the buttons switch to "Go to course" right away, and the course leaves the
 * cart + wishlist (the database trigger removes it there too).
 */
export const useEnroll = () =>
    useOptimisticIdsMutation({
        mutationFn: (courseId: string) => enrollService(courseId),
        updates: [
            { queryKey: enrollmentsQueryKey, update: (ids, courseId) => addId(ids, courseId) },
            { queryKey: cartQueryKey, update: (ids, courseId) => removeId(ids, courseId) },
            { queryKey: wishlistQueryKey, update: (ids, courseId) => removeId(ids, courseId) },
        ],
        successMessage: "You're enrolled! Find the course in My courses",
        errorMessage: "Couldn't enroll in this course",
    });
