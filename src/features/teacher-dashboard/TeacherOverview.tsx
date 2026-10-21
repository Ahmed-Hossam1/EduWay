import { Suspense } from "react";
import { CompleteProfileCard } from "./components/overview/CompleteProfileCard";
import { EarningsChart } from "./components/overview/EarningsChart";
import { InsightCard } from "./components/overview/InsightCard";
import { NewStudentsCard } from "./components/overview/NewStudentsCard";
import { RecentSalesCard, RecentSalesCardSkeleton } from "./components/overview/RecentSalesCard";
import { EarningsChartSkeleton, InsightCardSkeleton, NewStudentsCardSkeleton, StatsCardsSkeleton } from "./components/overview/skeleton";
import { StatsCards } from "./components/overview/StatsCards";
import { TeacherProfileCard, TeacherProfileCardSkeleton } from "./components/overview/TeacherProfileCard";
import { TopCoursesFan, TopCoursesFanSkeleton } from "./components/overview/TopCoursesFan";
import { getOverviewStats } from "./server/getOverviewStats";
import { getEarningsOverview } from "./server/getEarningsOverview";
import { getTopCourses } from "./server/getTopCourses";
import { getRecentSales } from "./server/getRecentSales";
import { getOverviewInsight } from "./server/getOverviewInsight";
import { getNewStudents } from "./server/getNewStudents";

/**
 * The teacher Overview: a bento grid of cards.
 *
 * Streaming: all the functions START together here (no await),
 * then each card has its OWN <Suspense> + skeleton → it appears as soon as ITS data is ready.
 * Inside, they share 3 cached queries (server/base): courses, sales, enrollments → asked once each.
 *
 * Grid: 1 column on mobile, 2 on tablets, 4 on big screens ("sm:col-span-2" = a wide card).
 */
type TeacherOverviewProps = {
    teacherId: string;
};

export function TeacherOverview({ teacherId }: TeacherOverviewProps) {
    // start everything now, in parallel (no await → the page doesn't wait)
    const statsPromise = getOverviewStats(teacherId);
    const earningsPromise = getEarningsOverview(teacherId);
    const topCoursesPromise = getTopCourses(teacherId);
    const salesPromise = getRecentSales(teacherId);
    const insightPromise = getOverviewInsight(teacherId);
    const studentsPromise = getNewStudents(teacherId);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">Overview</h1>
                <p className="mt-1 text-sm text-muted-foreground">How your courses are doing this month.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {/* Row 1: the 4 numbers */}
                <Suspense fallback={<StatsCardsSkeleton />}>
                    <StatsCards statsPromise={statsPromise} />
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
                    <InsightCard insightPromise={insightPromise} />
                </Suspense>
                <Suspense fallback={<NewStudentsCardSkeleton />}>
                    <NewStudentsCard studentsPromise={studentsPromise} />
                </Suspense>
            </div>
        </div>
    );
}
