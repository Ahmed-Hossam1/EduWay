import apiClient from "@/lib/axios/apiClient";
import { signupSchemaType } from "../schemas/signupSchema";
import { AuthResponse } from "../../shared/types";

export const signupService = async (data: signupSchemaType): Promise<AuthResponse> => {
    return await apiClient.post<AuthResponse>("/auth/signup", data)
}
