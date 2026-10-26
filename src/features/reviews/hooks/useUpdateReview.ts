"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { UpdateReviewValues } from "../schemas/reviewSchemas";
import { updateReviewService } from "../services/reviews";
import { reviewsQueryKey } from "./useCourseReviews";

type UpdateReviewVariables = {
    courseId: string; // which list to load again
    reviewId: string;
    values: UpdateReviewValues;
};

/**
 * Edit your review (stars + text) or your reply (text).
 * The list comes again + router.refresh() (new stars → new rating at the top of the page).
 *
 *   updateReview({ courseId, reviewId, values: { rating: 4, body: "Good" } });
 */
export const useUpdateReview = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: ({ reviewId, values }: UpdateReviewVariables) => updateReviewService({ reviewId, values }),

        onSuccess: (_data, { courseId, values }) => {
            toast.success("Comment updated");
            queryClient.invalidateQueries({ queryKey: reviewsQueryKey(courseId) });
            if (values.rating) router.refresh();
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't update your comment"));
        },
    });
};
