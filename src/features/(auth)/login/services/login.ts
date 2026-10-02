import apiClient from "@/lib/axios/apiClient";
import { LoginSchemaType } from "../schema/loginSchema";
import { AuthResponse } from "../../shared/types/AuthInputs";

export const loginService = async (data: LoginSchemaType): Promise<AuthResponse> => {
    return await apiClient.post<AuthResponse>("/login", data)
}

