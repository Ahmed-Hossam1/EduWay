import { SearchX } from "lucide-react";
import { CourseCard } from "./components/CourseCard";
import { CoursesHero } from "./components/CoursesHero";
import { CoursesFilters } from "./components/CoursesFilters";
import { CoursesToolbar } from "./components/CoursesToolbar";
import { CoursesPagination } from "./components/CoursesPagination";
import { CoursesResponse } from "./types";

type CoursesPageProps = {
  data: CoursesResponse;
};

export function CoursesPage({ data }: CoursesPageProps) {
  const { courses, totalCount } = data;

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
            <CoursesToolbar resultsCount={totalCount} />

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
                <SearchX className="size-10 text-muted-foreground" />
                <h2 className="mt-4 text-base font-semibold text-foreground">No courses found</h2>
                <p className="mt-1 text-sm text-muted-foreground">Try another search or remove some filters.</p>
              </div>
            )}

            <CoursesPagination />
          </div>
        </div>
      </section>
    </>
  );
}
