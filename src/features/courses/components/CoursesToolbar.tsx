import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CoursesResponse, FilterOption } from "../types";
import { CoursesCount } from "./CoursesCount";
import { CoursesCategoryChipsSkeleton } from "./CoursesCategoryChipsSkeleton";
import { CoursesCategoryChips } from "./CoursesCategoryChips";
import { CoursesMobileFilters } from "./CoursesMobileFilters";
import { UrlSortSelect } from "@/components/shared/UrlSortSelect";
import { coursesSortOptions } from "../data";
import { DEFAULT_COURSES_SORT } from "../schemas/coursesQuerySchema";

interface CoursesToolbarProps {
    coursesPromise: Promise<CoursesResponse>;
    categoryPromise: Promise<FilterOption[]>;
}

export function CoursesToolbar({ coursesPromise, categoryPromise }: CoursesToolbarProps) {
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
                    <CoursesMobileFilters categoriesPromise={categoryPromise} />

                    <span className="hidden text-sm text-muted-foreground sm:inline">Sort by</span>
                    <UrlSortSelect
                        options={coursesSortOptions}
                        defaultValue={DEFAULT_COURSES_SORT}
                        label="Sort courses"
                        className="h-9 min-w-44"
                    />
                </div>
            </div>
        </div>
    );
}
