import { Suspense } from "react";
import { EarningsOverview, OverviewStats } from "@/features/teacher-dashboard/types";
import { MyCoursesResponse } from "./types";
import { MyCoursesHeader } from "./components/MyCoursesHeader";
import { MyCoursesSummary } from "./components/MyCoursesSummary";
import { MyCoursesToolbar } from "./components/MyCoursesToolbar";
import { MyCoursesList } from "./components/MyCoursesList";
import { MyCoursesListSkeleton, MyCoursesSummarySkeleton } from "./components/skeleton";

type MyCoursesPageProps = {
    statsPromise: Promise<OverviewStats>;
    earningsPromise: Promise<EarningsOverview>;
    coursesPromise: Promise<MyCoursesResponse>;
    filtersKey: string; // changes when the filters change → the list shows its skeleton again
    hasFilters: boolean; // a search or a status tab is on → "no results" instead of "create your first course"
};

export function MyCoursesPage({
    statsPromise,
    earningsPromise,
    coursesPromise,
    filtersKey,
    hasFilters,
}: MyCoursesPageProps) {
    return (
        <div className="space-y-6">
            <MyCoursesHeader />

            {/* no key the numbers don't reload when only the filters change */}
            <Suspense fallback={<MyCoursesSummarySkeleton />}>
                <MyCoursesSummary statsPromise={statsPromise} earningsPromise={earningsPromise} />
            </Suspense>

            <div className="space-y-4">
                <MyCoursesToolbar />

                <Suspense key={filtersKey} fallback={<MyCoursesListSkeleton />}>
                    <MyCoursesList coursesPromise={coursesPromise} hasFilters={hasFilters} />
                </Suspense>
            </div>
        </div>
    );
}
