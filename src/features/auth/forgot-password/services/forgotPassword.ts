import { apiClient } from "@/lib/axios/apiClient";
import { ForgotPasswordSchemaType } from "../schemas/forgotPasswordSchema";

type ForgotPasswordResponse = {
    message: string; // "If an account exists for this email, we sent a link..."
};

// POST /api/auth/forgot-password → Supabase sends the reset email
export const forgotPasswordService = async (data: ForgotPasswordSchemaType) => {
    return await apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", data);
};
