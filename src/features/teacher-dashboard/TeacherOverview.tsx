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
import { EarningsOverview, NewStudent, OverviewStats, RecentSale, TopCourse } from "./types";

/**
 * The teacher Overview: a bento grid of cards.
 *
 * Streaming: the page STARTS all the functions together (no await) and passes the promises here,
 * then each card has its OWN <Suspense> + skeleton → it appears as soon as ITS data is ready
 * (the same pattern as the other pages: page.tsx starts the work, the feature shows it).
 * The numbers + the chart come ready from 2 database functions (supabase.rpc);
 * the lists (top courses, sales, students) are one small query each (sorted + limited in the database).
 *
 * Grid: 1 column on mobile, 2 on tablets, 4 on big screens ("sm:col-span-2" = a wide card).
 */
type TeacherOverviewProps = {
    statsPromise: Promise<OverviewStats>;
    earningsPromise: Promise<EarningsOverview>;
    topCoursesPromise: Promise<TopCourse[]>;
    salesPromise: Promise<RecentSale[]>;
    studentsPromise: Promise<NewStudent[]>;
};

export function TeacherOverview({
    statsPromise,
    earningsPromise,
    topCoursesPromise,
    salesPromise,
    studentsPromise,
}: TeacherOverviewProps) {
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
