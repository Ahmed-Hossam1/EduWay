import { apiClient } from "@/lib/axios/apiClient";

// POST /api/notifications/read-all → all my notifications become read
export const markAllReadService = async () => {
    return await apiClient.post<{ message: string }>("/notifications/read-all");
};
