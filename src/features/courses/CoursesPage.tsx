import { Suspense } from "react";
import { CoursesFilters } from "./components/CoursesFilters";
import { CoursesHero } from "./components/CoursesHero";
import { CoursesPagination } from "./components/CoursesPagination";
import { CoursesSkeleton } from "./components/CoursesSkeleton";
import { CoursesToolbar } from "./components/CoursesToolbar";
import { CoursesResponse, FilterOption } from "./types";
import { CoursesGrid } from "./components/CoursesGrid";
import { CoursesFiltersSkeleton } from "./components/CoursesFiltersSkeleton";
import { CoursesPaginationSkeleton } from "./components/CoursesPaginationSkeleton";

type CoursesPageProps = {
    coursesPromise: Promise<CoursesResponse>;
    categoriesPromise: Promise<FilterOption[]>;
    filtersKey: string; // changes when the filters change => shows the skeleton again
    searchQuery: string; // q from the URL ("" = no search)
};

export function CoursesPage({ coursesPromise, categoriesPromise, filtersKey, searchQuery }: CoursesPageProps) {
    return (
        <>
            {/* key = q → when q changes in the URL (Clear all, Navbar search...) React makes a NEW hero,
          so the search input starts again from the new q (useState reads its first value only once) */}
            <CoursesHero key={searchQuery} />
            <section className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
                    {/* Filters sidebar (desktop) */}
                    <div className="hidden lg:block">
                        <Suspense fallback={<CoursesFiltersSkeleton />}>
                            <CoursesFilters categoriesPromise={categoriesPromise} />
                        </Suspense>
                    </div>

                    <div className="min-w-0 space-y-8">
                        <CoursesToolbar coursesPromise={coursesPromise} categoryPromise={categoriesPromise} />

                        {/* Course cards: skeleton first, then the real cards when the data arrives */}
                        <Suspense key={`grid-${filtersKey}`} fallback={<CoursesSkeleton />}>
                            <CoursesGrid coursesPromise={coursesPromise} />
                        </Suspense>

                        <Suspense key={`pagination-${filtersKey}`} fallback={<CoursesPaginationSkeleton />}>
                            <CoursesPagination coursesPromise={coursesPromise} />
                        </Suspense>
                    </div>
                </div>
            </section>
        </>
    );
}
