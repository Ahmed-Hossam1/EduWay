import { apiClient } from "@/lib/axios/apiClient";
import { AuthRole } from "../../shared/types";
import { AuthResponse } from "../../shared/types";

// POST /api/auth/choose-role → every new user picks student / teacher once (email signup and Google / GitHub)
export const assignRoleService = async (role: AuthRole): Promise<AuthResponse> => {
    return await apiClient.post<AuthResponse>("/auth/choose-role", {
        role,
    });
};
