import { Metadata } from "next";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { TeacherCoursesPage } from "@/features/teacher-courses/TeacherCoursesPage";
import { teacherCoursesQuerySchema } from "@/features/teacher-courses/schemas/teacherCoursesQuerySchema";
import { getTeacherCourses } from "@/features/teacher-courses/server/getTeacherCourses";
import { getOverviewStats } from "@/features/teacher-dashboard/server/getOverviewStats";
import { getEarningsOverview } from "@/features/teacher-dashboard/server/getEarningsOverview";
import { parseSearchParams } from "@/lib/utils";

export const metadata: Metadata = {
    title: "My courses",
    robots: { index: false },
};

type Params = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// /teacher/courses → all the courses of the teacher (the layout already checked he's an approved teacher)
export default async function TeacherCourses({ searchParams }: Params) {
    await getAuthUser(); // not logged in → /auth/login (the layout checked it too)
    const params = await searchParams;

    // a broken URL (?page=abc) falls back to the defaults instead of crashing
    const query = parseSearchParams(teacherCoursesQuerySchema, params);

    // no await → the page shows right away, each part streams with its skeleton
    const statsPromise = getOverviewStats();
    const earningsPromise = getEarningsOverview();
    const coursesPromise = getTeacherCourses(query);

    return (
        <TeacherCoursesPage
            statsPromise={statsPromise}
            earningsPromise={earningsPromise}
            coursesPromise={coursesPromise}
            filtersKey={JSON.stringify(query)}
            hasFilters={Boolean(query.q) || query.status !== "all"}
        />
    );
}
