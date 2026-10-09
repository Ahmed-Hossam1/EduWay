import { Suspense } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coursesSortOptions } from "../data";
import { CoursesResponse, FilterOption } from "../types";
import { CoursesCount } from "./CoursesCount";
import { Skeleton } from "@/components/ui/skeleton";
import CoursesCategoryChips, {
  CoursesCategoryChipsSkeleton,
} from "./CoursesCategoryChips";

interface CoursesToolbarProps {
  coursesPromise: Promise<CoursesResponse>;
  categoryPromise: Promise<FilterOption[]>;
}

export function CoursesToolbar({
  coursesPromise,
  categoryPromise,
}: CoursesToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Category chips */}
      <Suspense fallback={<CoursesCategoryChipsSkeleton />}>
        <CoursesCategoryChips categoryPromise={categoryPromise} />
      </Suspense>

      {/* Results count + sort */}
      <div className="flex items-center justify-between gap-3">
        <Suspense fallback={<Skeleton className="h-4 w-32" />}>
          <CoursesCount coursesPromise={coursesPromise} />
        </Suspense>

        <div className="flex items-center gap-2">
          {/* Mobile only: the filters sidebar is hidden on small screens */}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Sort by</span>
            <select
              name="sort"
              defaultValue={coursesSortOptions[0].value}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {coursesSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
