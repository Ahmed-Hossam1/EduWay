import { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingWaiting } from "@/features/auth/onboarding/components/OnboardingWaiting";
import { getAuthRedirectRoute } from "@/features/auth/shared/utils/getAuthRedirectRoute";
import { getProfileByIdService } from "@/features/profile/server/getProfileById";
import { getAuthUser } from "@/lib/supabase/getAuthUser";

export const metadata: Metadata = {
    title: "Profile under review",
    robots: { index: false },
};

export default async function WaitingPage() {
    const user = await getAuthUser(); // not logged in → /auth/login

    const profile = await getProfileByIdService(user.id);

    // Only a teacher waiting for the review stays here, the others go where they belong
    if (profile.role !== "teacher" || profile.status !== "waiting") {
        redirect(getAuthRedirectRoute(profile.role, profile.status));
    }

    return <OnboardingWaiting firstName={profile.first_name ?? ""} />;
}
