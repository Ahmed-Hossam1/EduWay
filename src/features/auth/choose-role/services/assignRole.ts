import apiClient from "@/lib/axios/apiClient"
import { AuthRole } from "../../shared/types"
import { AuthResponse } from "../../shared/types"


// used  for 0Auth 
export const assignRole = async (role: AuthRole): Promise<AuthResponse> => {
    return await apiClient.post<AuthResponse>("/auth/choose-role", {
        role
    })
}

