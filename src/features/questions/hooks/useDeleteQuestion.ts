"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { deleteQuestionService } from "../services/questions";
import { questionsQueryKey } from "./useCourseQuestions";

type DeleteQuestionVariables = {
    courseId: string; // which list to load again
    questionId: string;
};

/**
 * Delete your question / answer. The list comes again.
 *
 *   deleteQuestion({ courseId, questionId });
 */
export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ questionId }: DeleteQuestionVariables) => deleteQuestionService(questionId),

        onSuccess: (_data, { courseId }) => {
            toast.success("Comment deleted");
            queryClient.invalidateQueries({ queryKey: questionsQueryKey(courseId) });
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't delete your comment"));
        },
    });
};
