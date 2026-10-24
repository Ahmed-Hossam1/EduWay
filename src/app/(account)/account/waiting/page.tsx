import { Metadata } from "next";
import { OnboardingWaiting } from "@/features/auth/onboarding/components/OnboardingWaiting";
import { requireProfileStatus } from "@/features/profile/server/requireProfileStatus";

export const metadata: Metadata = {
    title: "Profile under review",
    robots: { index: false },
};

export default async function WaitingPage() {
    // Only a teacher waiting for the review stays here, the others go where they belong (or to /auth/login)
    const { profile } = await requireProfileStatus("teacher", "waiting");

    return <OnboardingWaiting firstName={profile.first_name ?? ""} />;
}
