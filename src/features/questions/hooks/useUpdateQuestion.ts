"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { updateQuestionService } from "../services/questions";
import { questionsQueryKey } from "./useCourseQuestions";

type UpdateQuestionVariables = {
    courseId: string; // which list to load again
    questionId: string;
    body: string;
};

/**
 * Edit your question / answer (the text). The list comes again.
 *
 *   updateQuestion({ courseId, questionId, body: "New text" });
 */
export const useUpdateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ questionId, body }: UpdateQuestionVariables) => updateQuestionService({ questionId, body }),

        onSuccess: (_data, { courseId }) => {
            toast.success("Comment updated");
            queryClient.invalidateQueries({ queryKey: questionsQueryKey(courseId) });
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't update your comment"));
        },
    });
};
