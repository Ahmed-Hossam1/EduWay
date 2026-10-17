import { apiClient } from "@/lib/axios/apiClient";
import { AuthResponse } from "../../shared/types";
import { ResetPasswordSchemaType } from "../schemas/resetPasswordSchema";

// POST /api/auth/reset-password → { nextRoute: "/auth/login" }
export const resetPasswordService = async (data: ResetPasswordSchemaType): Promise<AuthResponse> => {
    return await apiClient.post<AuthResponse>("/auth/reset-password", data);
};
