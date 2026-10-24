import { apiClient } from "@/lib/axios/apiClient";

// POST /api/auth/logout → the server ends the session
export const logoutService = async () => {
    return await apiClient.post<{ message: string }>("/auth/logout");
};
