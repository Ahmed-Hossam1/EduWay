import { apiClient } from "@/lib/axios/apiClient";

type ReapplyResponse = {
    nextRoute: string; // "/account/onboarding"
};

// POST /api/onboarding/reapply → a rejected teacher goes back to the onboarding
export const reapplyService = async () => {
    return await apiClient.post<ReapplyResponse>("/onboarding/reapply");
};
