"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { createQuestionService } from "../services/questions";
import { questionsQueryKey } from "./useCourseQuestions";

/**
 * Ask a question, or answer / reply in a question (with a parentId).
 * The list comes again (invalidate) with the new comment in it.
 *
 *   createQuestion({ courseId, values: { body, lessonId } });            → a question
 *   createQuestion({ courseId, values: { body, lessonId, parentId } });  → an answer
 */
export const useCreateQuestion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createQuestionService,

        onSuccess: (_data, { courseId, values }) => {
            toast.success(values.parentId ? "Reply posted" : "Question posted");
            queryClient.invalidateQueries({ queryKey: questionsQueryKey(courseId) });
        },

        onError: (error) => {
            console.error(error);
            toast.error(getErrorMessage(error, "Couldn't post your comment"));
        },
    });
};
