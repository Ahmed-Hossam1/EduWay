import { apiClient } from "@/lib/axios/apiClient";
import { ResendConfirmationSchemaType } from "../schemas/resendConfirmationSchema";

type ResendConfirmationResponse = {
    message: string; // "If this email is waiting for confirmation, we sent a new link."
};

// POST /api/auth/resend-confirmation → Supabase sends the "Confirm signup" email again
export const resendConfirmationService = async (data: ResendConfirmationSchemaType) => {
    return await apiClient.post<ResendConfirmationResponse>("/auth/resend-confirmation", data);
};
