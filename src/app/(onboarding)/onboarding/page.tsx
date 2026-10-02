import { TeacherOnboardingContainer } from "@/features/(auth)/onboarding";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Teacher Onboarding - EduWay",
    description:
        "Build your teacher profile on EduWay. Share your skills, background, and start teaching students worldwide.",
};

export default function OnboardingPage() {
    return <TeacherOnboardingContainer />;
}