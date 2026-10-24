import { TeacherOnboardingContainer } from "@/features/auth/onboarding/components/TeacherOnboardingContainer";
import { getOnboardingDefaults } from "@/features/auth/onboarding/server/getOnboardingDefaults";
import { getCategoryOptions } from "@/features/auth/onboarding/server/getCategoryOptions";
import { getSavedOnboardingAnswers } from "@/features/auth/onboarding/server/getSavedOnboardingAnswers";
import { requireProfileStatus } from "@/features/profile/server/requireProfileStatus";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Teacher Onboarding - EduWay",
    description:
        "Build your teacher profile on EduWay. Share your skills, background, and start teaching students worldwide.",
};

export default async function OnboardingPage() {
    // 1+2- Only a teacher who didn't finish the onboarding stays here.
    //      Everyone else goes where he belongs (guest → login, student → home, no role → choose-role,
    //      teacher waiting → /account/waiting, approved → dashboard...)
    const { user, profile } = await requireProfileStatus("teacher", "onboarding");

    // 3- The name + photo he already gave us (+ his old answers if he applies again),
    //    and the categories from the database
    const saved = await getSavedOnboardingAnswers(user.id);
    const defaultValues = getOnboardingDefaults(user, profile, saved);
    const categories = await getCategoryOptions();

    return <TeacherOnboardingContainer defaultValues={defaultValues} categories={categories} />;
}
