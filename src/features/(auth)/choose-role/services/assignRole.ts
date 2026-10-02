import apiClient from "@/lib/axios/apiClient"
import { AuthRole } from "../../signup/types"
import { AuthResponse } from "../../shared/types/AuthInputs"


// used  for 0Auth 
export const assignRole = async (role: AuthRole): Promise<AuthResponse> => {
    return await apiClient.post<AuthResponse>("/choose-role", {
        role
    })
}

