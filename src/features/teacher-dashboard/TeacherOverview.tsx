import { Suspense } from "react";
import { CompleteProfileCard } from "./components/overview/CompleteProfileCard";
import { EarningsChart } from "./components/overview/EarningsChart";
import { InsightCard } from "./components/overview/InsightCard";
import { NewStudentsCard } from "./components/overview/NewStudentsCard";
import { RecentSalesCard } from "./components/overview/RecentSalesCard";
import {
    EarningsChartSkeleton,
    InsightCardSkeleton,
    NewStudentsCardSkeleton,
    RecentSalesCardSkeleton,
    StatsCardsSkeleton,
    TeacherProfileCardSkeleton,
    TopCoursesFanSkeleton,
} from "./components/overview/skeleton";
import { StatsCards } from "./components/overview/StatsCards";
import { TeacherProfileCard } from "./components/overview/TeacherProfileCard";
import { TopCoursesFan } from "./components/overview/TopCoursesFan";
import { getOverviewStats } from "./server/getOverviewStats";
import { getEarningsOverview } from "./server/getEarningsOverview";
import { getTeacherTopCourses } from "./server/getTeacherTopCourses";
import { getTeacherRecentSales } from "./server/getTeacherRecentSales";
import { getTeacherNewStudents } from "./server/getTeacherNewStudents";

/**
 * The teacher Overview: a bento grid of cards.
 *
 * Streaming: all the functions START together here (no await),
 * then each card has its OWN <Suspense> + skeleton → it appears as soon as ITS data is ready.
 * The numbers + the chart come ready from 2 database functions (supabase.rpc);
 * the lists (top courses, sales, students) are one small query each (sorted + limited in the database).
 *
 * Grid: 1 column on mobile, 2 on tablets, 4 on big screens ("sm:col-span-2" = a wide card).
 */
type TeacherOverviewProps = {
    teacherId: string;
};

export function TeacherOverview({ teacherId }: TeacherOverviewProps) {
    // start everything now, in parallel (no await → the page doesn't wait)
    const statsPromise = getOverviewStats();
    const earningsPromise = getEarningsOverview();
    const topCoursesPromise = getTeacherTopCourses(teacherId);
    const salesPromise = getTeacherRecentSales(teacherId);
    const studentsPromise = getTeacherNewStudents(teacherId);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">Overview</h1>
                <p className="mt-1 text-sm text-muted-foreground">How your courses are doing this month.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* Row 1: the 4 numbers */}
                <Suspense fallback={<StatsCardsSkeleton />}>
                    <StatsCards statsPromise={statsPromise} earningsPromise={earningsPromise} />
                </Suspense>

                {/* Row 2: chart (3 columns wide) + profile */}
                <Suspense fallback={<EarningsChartSkeleton />}>
                    <EarningsChart earningsPromise={earningsPromise} />
                </Suspense>
                <Suspense fallback={<TeacherProfileCardSkeleton />}>
                    {/* the SAME statsPromise → the numbers need no extra query */}
                    <TeacherProfileCard statsPromise={statsPromise} />
                </Suspense>

                {/* Row 3: top courses (wide, the hover fan) + sales + tip */}
                <Suspense fallback={<TopCoursesFanSkeleton />}>
                    <TopCoursesFan topCoursesPromise={topCoursesPromise} />
                </Suspense>
                <Suspense fallback={<RecentSalesCardSkeleton />}>
                    <RecentSalesCard salesPromise={salesPromise} />
                </Suspense>
                <CompleteProfileCard />

                {/* Row 4: insight (wide) + new students (wide) */}
                <Suspense fallback={<InsightCardSkeleton />}>
                    <InsightCard statsPromise={statsPromise} />
                </Suspense>
                <Suspense fallback={<NewStudentsCardSkeleton />}>
                    <NewStudentsCard studentsPromise={studentsPromise} />
                </Suspense>
            </div>
        </div>
    );
}
