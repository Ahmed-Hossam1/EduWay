import { apiClient } from "@/lib/axios/apiClient";

// POST /api/notifications/:notificationId/read → this notification becomes read
export const markReadService = async (notificationId: string) => {
    return await apiClient.post<{ message: string }>(`/notifications/${notificationId}/read`);
};
