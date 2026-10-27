import { apiClient } from "@/lib/axios/apiClient";
import { CommentSort } from "@/features/comments/types";
import { CreateQuestionValues } from "../schemas/questionSchemas";
import { CourseQuestionsPage } from "../types";

// GET /api/courses/:courseId/questions?lessonId&sort&offset → one page of questions
export const getCourseQuestionsService = async ({
    courseId,
    lessonId,
    sort,
    offset,
}: {
    courseId: string;
    lessonId: string | null;
    sort: CommentSort;
    offset: number;
}) => {
    return await apiClient.get<CourseQuestionsPage>(`/courses/${courseId}/questions`, {
        lessonId: lessonId ?? undefined, // no lessonId → the course page questions
        sort,
        offset,
    });
};

// POST /api/courses/:courseId/questions { body, lessonId?, parentId? } → a question or an answer
export const createQuestionService = async ({
    courseId,
    values,
}: {
    courseId: string;
    values: CreateQuestionValues;
}) => {
    return await apiClient.post<{ id: string }>(`/courses/${courseId}/questions`, values);
};

// PATCH /api/questions/:questionId { body } → edit your question / answer
export const updateQuestionService = async ({ questionId, body }: { questionId: string; body: string }) => {
    return await apiClient.patch<{ message: string }>(`/questions/${questionId}`, { body });
};

// DELETE /api/questions/:questionId → delete your question / answer
export const deleteQuestionService = async (questionId: string) => {
    return await apiClient.delete<{ message: string }>(`/questions/${questionId}`);
};

// PUT /api/questions/:answerId/best { isBest } → mark / unmark the best answer
export const markBestAnswerService = async ({ answerId, isBest }: { answerId: string; isBest: boolean }) => {
    return await apiClient.put<{ message: string }>(`/questions/${answerId}/best`, { isBest });
};
