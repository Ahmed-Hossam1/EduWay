import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/axios/getErrorMessage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OnboardingFormValues } from "../schemas/onboardingSchema";
import { profileQueryKey } from "@/features/profile/hooks/useProfile";
import { submitOnboardingService } from "../services/submitOnboarding";

/**
 * "Finish" button of the onboarding: save -> go to /account/waiting.
 */
export const useSubmitOnboarding = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: OnboardingFormValues) => submitOnboardingService(values),
        onSuccess(response) {
            // the name / photo may have changed => the Navbar loads the profile again
            queryClient.invalidateQueries({ queryKey: profileQueryKey });
            toast.success("Your profile was submitted for review");
            router.push(response.nextRoute);
        },
        onError(err) {
            console.error(err);
            toast.error(getErrorMessage(err, "Failed to submit your profile"));
        },
    });
};
