import { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingRejected } from "@/features/auth/onboarding/components/OnboardingRejected";
import { getAuthRedirectRoute } from "@/features/auth/shared/utils/getAuthRedirectRoute";
import { getProfileByIdService } from "@/features/profile/server/getProfileById";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
    title: "Profile not approved",
    robots: { index: false },
};

export default async function RejectedPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const profile = await getProfileByIdService(user.id);

    // Only a rejected teacher stays here, the others go where they belong
    if (profile.role !== "teacher" || profile.status !== "rejected") {
        redirect(getAuthRedirectRoute(profile.role, profile.status));
    }

    return <OnboardingRejected firstName={profile.first_name ?? ""} />;
}
