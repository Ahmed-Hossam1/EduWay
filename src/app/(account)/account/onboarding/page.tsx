import { TeacherOnboardingContainer } from "@/features/auth/onboarding";
import { getOnboardingDefaults } from "@/features/auth/onboarding/server/getOnboardingDefaults";
import { getCategoryOptions } from "@/features/auth/onboarding/server/getCategoryOptions";
import { getAuthRedirectRoute } from "@/features/auth/shared/utils/getAuthRedirectRoute";
import { getProfileByIdService } from "@/features/profile/server/getProfileById";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Teacher Onboarding - EduWay",
    description:
        "Build your teacher profile on EduWay. Share your skills, background, and start teaching students worldwide.",
};

export default async function OnboardingPage() {
    // 1- Who is he? (proxy.ts already sends guests to /auth/login)
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login");

    const profile = await getProfileByIdService(user.id);

    // 2- Only a teacher who didn't finish the onboarding stays here.
    //    Everyone else goes where he belongs (student → home, no role → choose-role,
    //    teacher waiting → /account/waiting, approved → dashboard...)
    if (profile.role !== "teacher" || profile.status !== "onboarding") {
        redirect(getAuthRedirectRoute(profile.role, profile.status));
    }

    // 3- The name + photo he already gave us, and the categories from the database
    const defaultValues = getOnboardingDefaults(user, profile);
    const categories = await getCategoryOptions();

    return <TeacherOnboardingContainer defaultValues={defaultValues} categories={categories} />;
}
