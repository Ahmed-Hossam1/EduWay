import { apiClient } from "@/lib/axios/apiClient";
import { signupSchemaType } from "../schemas/signupSchema";
import { SignupResponse } from "../types";

export const signupService = async (data: signupSchemaType): Promise<SignupResponse> => {
    return await apiClient.post<SignupResponse>("/auth/signup", data);
};
