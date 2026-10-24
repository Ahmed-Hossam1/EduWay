import { Metadata } from "next";
import { TeacherOverview } from "@/features/teacher-dashboard/TeacherOverview";
import { getOverviewStats } from "@/features/teacher-dashboard/server/getOverviewStats";
import { getEarningsOverview } from "@/features/teacher-dashboard/server/getEarningsOverview";
import { getTeacherTopCourses } from "@/features/teacher-dashboard/server/getTeacherTopCourses";
import { getTeacherRecentSales } from "@/features/teacher-dashboard/server/getTeacherRecentSales";
import { getTeacherNewStudents } from "@/features/teacher-dashboard/server/getTeacherNewStudents";

export const metadata: Metadata = {
    title: "Overview",
    robots: { index: false },
};

// /teacher/dashboard → the Overview (each card streams with its own skeleton)
// The layout already checked that he is an approved teacher; every function finds the teacher from the session.
export default function TeacherDashboardPage() {
    // start everything now, in parallel (no await → the page shows right away)
    return (
        <TeacherOverview
            statsPromise={getOverviewStats()}
            earningsPromise={getEarningsOverview()}
            topCoursesPromise={getTeacherTopCourses()}
            salesPromise={getTeacherRecentSales()}
            studentsPromise={getTeacherNewStudents()}
        />
    );
}
