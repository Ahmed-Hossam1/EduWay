import { apiClient } from "@/lib/axios/apiClient";

// POST /api/courses/:courseId/unpublish → published → draft
export const unpublishCourseService = async (courseId: string) => {
    return await apiClient.post<{ message: string }>(`/courses/${courseId}/unpublish`);
};

// DELETE /api/courses/:courseId → deletes a draft
export const deleteDraftCourseService = async (courseId: string) => {
    return await apiClient.delete<{ message: string }>(`/courses/${courseId}`);
};
