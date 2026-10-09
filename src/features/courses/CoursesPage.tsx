import { Suspense } from "react";
import { CoursesFilters } from "./components/CoursesFilters";
import { CoursesHero } from "./components/CoursesHero";
import { CoursesPagination } from "./components/CoursesPagination";
import CoursesGridSkeleton from "./components/CoursesSkeleton";
import { CoursesToolbar } from "./components/CoursesToolbar";
import { CoursesResponse } from "./types";
import CoursesGrid from "./components/CoursesGrid";

type CoursesPageProps = {
  coursesPromise: Promise<CoursesResponse>;
  filtersKey: string; // changes when the filters change => shows the skeleton again
};

export function CoursesPage({ coursesPromise, filtersKey }: CoursesPageProps) {
  return (
    <>
      <CoursesHero />
      <section className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
          {/* Filters sidebar (desktop) */}
          <div className="hidden lg:block">
            <CoursesFilters />
          </div>

          <div className="min-w-0 space-y-8">
            <CoursesToolbar coursesPromise={coursesPromise} />

            {/* Course cards: skeleton first, then the real cards when the data arrives */}
            <Suspense key={filtersKey} fallback={<CoursesGridSkeleton />}>
              <CoursesGrid coursesPromise={coursesPromise} />
            </Suspense>

            <CoursesPagination />
          </div>
        </div>
      </section>
    </>
  );
}
