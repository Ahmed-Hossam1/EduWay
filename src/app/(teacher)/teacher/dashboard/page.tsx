import { Metadata } from "next";
import { TeacherOverview } from "@/features/teacher-dashboard/TeacherOverview";
import { getAuthUser } from "@/lib/supabase/getAuthUser";

export const metadata: Metadata = {
    title: "Overview",
    robots: { index: false },
};

// /teacher/dashboard → the Overview (each card streams with its own skeleton)
// The layout already checked that he is an approved teacher.
export default async function TeacherDashboardPage() {
    const user = await getAuthUser(); // cached: the layout asked already → no new request

    return <TeacherOverview teacherId={user.id} />;
}
