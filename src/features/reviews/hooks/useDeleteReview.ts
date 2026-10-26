"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { deleteReviewService } from "../services/reviews";
import { reviewsQueryKey } from "./useCourseReviews";

type DeleteReviewVariables = {
    courseId: string; // which list to load again
    reviewId: string;
};

/**
 * Delete your review or reply.
 * The list comes again + router.refresh() (a deleted review changes the rating at the top of the page).
 *
 *   deleteReview({ courseId, reviewId });
 */
export const useDeleteReview = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: ({ reviewId }: DeleteReviewVariables) => deleteReviewService(reviewId),

        onSuccess: (_data, { courseId }) => {
            toast.success("Comment deleted");
            queryClient.invalidateQueries({ queryKey: reviewsQueryKey(courseId) });
            router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't delete your comment"));
        },
    });
};
