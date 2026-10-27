"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { markBestAnswerService } from "../services/questions";
import { questionsQueryKey } from "./useCourseQuestions";

type MarkBestAnswerVariables = {
    courseId: string; // which list to load again
    answerId: string;
    isBest: boolean; // true = mark, false = unmark
};

/**
 * "Mark as best answer" / "Remove best answer" (the asker or the teacher).
 * The list comes again → the best answer moves to the top of the answers.
 *
 *   markBestAnswer({ courseId, answerId, isBest: true });
 */
export const useMarkBestAnswer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ answerId, isBest }: MarkBestAnswerVariables) => markBestAnswerService({ answerId, isBest }),

        onSuccess: (result, { courseId }) => {
            toast.success(result.message);
            queryClient.invalidateQueries({ queryKey: questionsQueryKey(courseId) });
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't update the best answer"));
        },
    });
};
