"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { createReviewService } from "../services/reviews";
import { reviewsQueryKey } from "./useCourseReviews";

/**
 * Post a review (stars + text).
 * The list comes again (invalidate) + router.refresh() for the rating at the top of the page.
 *
 *   createReview({ courseId, values: { rating: 5, body: "Great" } });
 */
export const useCreateReview = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: createReviewService,

        onSuccess: (_data, { courseId }) => {
            toast.success("Thanks for your review!");
            queryClient.invalidateQueries({ queryKey: reviewsQueryKey(courseId) });
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't post your review"));
        },
    });
};
