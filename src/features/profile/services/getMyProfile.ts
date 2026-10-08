import apiClient from "@/lib/axios/apiClient"
import { ProfileSummary } from "../types"

// Client service: asks our API for the profile of the logged-in user
export const getMyProfileService = async (): Promise<ProfileSummary> => {
    return await apiClient.get<ProfileSummary>("/auth/me")
}
