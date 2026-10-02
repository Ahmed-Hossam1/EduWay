import apiClient from "@/lib/axios/apiClient";
import { signupSchemaType } from "../schema/schema";
import { AuthResponse } from "../../shared/types/AuthInputs";

export const signupService = async (data: signupSchemaType): Promise<AuthResponse> => {
    return await apiClient.post<AuthResponse>("/signup", data)
}
