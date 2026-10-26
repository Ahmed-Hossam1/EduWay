import { apiClient } from "@/lib/axios/apiClient";
import { CompleteLessonResult } from "../types";

// PUT /api/lessons/:lessonId/progress → mark the lesson as done (or not done)
export const completeLessonService = async ({ lessonId, completed }: { lessonId: string; completed: boolean }) => {
    return await apiClient.put<CompleteLessonResult>(`/lessons/${lessonId}/progress`, { completed });
};
