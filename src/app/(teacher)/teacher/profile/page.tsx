import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeacherProfile } from "@/features/teacher-profile/server/getTeacherProfile";
import { TeacherProfileForm } from "@/features/teacher-profile/TeacherProfileForm";

export const metadata: Metadata = {
    title: "Instructor profile",
    robots: { index: false },
};

export default async function TeacherProfilePage() {
    const profile = await getTeacherProfile();
    if (!profile) notFound();

    return (
        <div className="mx-auto max-w-2xl space-y-6 py-4">
            <div>
                <h1 className="text-2xl font-black tracking-tight">Instructor profile</h1>
                <p className="text-sm text-muted-foreground">
                    This information appears on your public instructor page.
                </p>
            </div>
            <TeacherProfileForm key={profile.id} profile={profile} />
        </div>
    );
}
