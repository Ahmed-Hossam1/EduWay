import { use } from "react";
import { SearchX } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { CoursesResponse } from "../types";

type CoursesGridProps = {
  coursesPromise: Promise<CoursesResponse>;
};

// Shows the course cards.
// It receives the promise (not the data) → use() waits for it,
// and <Suspense> shows <CoursesGridSkeleton /> until the data is ready.
export default function CoursesGrid({ coursesPromise }: CoursesGridProps) {
  const { courses } = use(coursesPromise);

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
        <SearchX className="size-10 text-muted-foreground" />
        <h2 className="mt-4 text-base font-semibold text-foreground">No courses found</h2>
        <p className="mt-1 text-sm text-muted-foreground">Try another search or remove some filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

