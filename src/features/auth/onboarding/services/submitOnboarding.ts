import apiClient from "@/lib/axios/apiClient";
import { OnboardingFormValues } from "../schemas/onboardingSchema";

type SubmitOnboardingResponse = {
    message: string;
    nextRoute: string; // "/account/waiting"
};

// POST /api/onboarding => saves the teacher profile and sends it for review
export const submitOnboardingService = async (values: OnboardingFormValues) => {
    return await apiClient.post<SubmitOnboardingResponse>("/onboarding", values);
};
