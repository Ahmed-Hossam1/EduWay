"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { createReplyService } from "../services/reviews";
import { reviewsQueryKey } from "./useCourseReviews";

/**
 * Reply to a review or to a reply. The list comes again (invalidate) with the new reply in it.
 *
 *   replyToReview({ courseId, parentId, values: { body: "I agree" } });
 */
export const useReplyToReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createReplyService,

        onSuccess: (_data, { courseId }) => {
            toast.success("Reply posted");
            queryClient.invalidateQueries({ queryKey: reviewsQueryKey(courseId) });
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't post your reply"));
        },
    });
};
