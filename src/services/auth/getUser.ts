import { AuthRole } from "@/features/(auth)/signup/types";
import apiClient from "@/lib/axios/apiClient"

type IProfile = {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    role: AuthRole;
    created_at: string;
    updated_at: string;
};

export const getUserService = async (): Promise<IProfile> => {
    const response = await apiClient.get<{ profile: IProfile }>(`/me`)
    return response.profile
}

