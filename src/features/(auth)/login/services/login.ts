import apiClient from "@/lib/axios/apiClient";
import { LoginResponse } from "../types";
import { LoginSchemaType } from "../schema/loginSchema";

export const loginService = async (data: LoginSchemaType): Promise<LoginResponse> => {
    return await apiClient.post<LoginResponse>("/login", data)
}

