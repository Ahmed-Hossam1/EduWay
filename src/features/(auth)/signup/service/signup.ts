import apiClient from "@/lib/axios/apiClient";
import { signupSchemaType } from "../schema/schema";
import { SignupResponse } from "../types";

export const signupService = async (data: signupSchemaType): Promise<SignupResponse> => {
    return await apiClient.post<SignupResponse>("/signup", data)
}

