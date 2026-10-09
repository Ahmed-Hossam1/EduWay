import apiClient from "@/lib/axios/apiClient";
import { LoginSchemaType } from "../schemas/loginSchema";
import { AuthResponse } from "../../shared/types";

export const loginService = async (data: LoginSchemaType): Promise<AuthResponse> => {
    return await apiClient.post<AuthResponse>("/auth/login", data)
}

