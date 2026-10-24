import { Suspense } from "react";
import { EarningsOverview, OverviewStats } from "@/features/teacher-dashboard/types";
import { TeacherCoursesResponse } from "./types";
import { TeacherCoursesHeader } from "./components/TeacherCoursesHeader";
import { TeacherCoursesSummary } from "./components/TeacherCoursesSummary";
import { TeacherCoursesToolbar } from "./components/TeacherCoursesToolbar";
import { TeacherCoursesList } from "./components/TeacherCoursesList";
import { TeacherCoursesListSkeleton, TeacherCoursesSummarySkeleton } from "./components/skeleton";

type TeacherCoursesPageProps = {
    statsPromise: Promise<OverviewStats>;
    earningsPromise: Promise<EarningsOverview>;
    coursesPromise: Promise<TeacherCoursesResponse>;
    filtersKey: string; // changes when the filters change → the list shows its skeleton again
    hasFilters: boolean; // a search or a status tab is on → "no results" instead of "create your first course"
};

export function TeacherCoursesPage({
    statsPromise,
    earningsPromise,
    coursesPromise,
    filtersKey,
    hasFilters,
}: TeacherCoursesPageProps) {
    return (
        <div className="space-y-6">
            <TeacherCoursesHeader />

            {/* no key the numbers don't reload when only the filters change */}
            <Suspense fallback={<TeacherCoursesSummarySkeleton />}>
                <TeacherCoursesSummary statsPromise={statsPromise} earningsPromise={earningsPromise} />
            </Suspense>

            <div className="space-y-4">
                <TeacherCoursesToolbar />

                <Suspense key={filtersKey} fallback={<TeacherCoursesListSkeleton />}>
                    <TeacherCoursesList coursesPromise={coursesPromise} hasFilters={hasFilters} />
                </Suspense>
            </div>
        </div>
    );
}
