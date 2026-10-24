import { use } from "react";
import { SearchX } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { UrlPagination } from "@/components/shared/UrlPagination";
import { CourseCard } from "./CourseCard";
import { CoursesResponse } from "../types";

type CoursesGridProps = {
    coursesPromise: Promise<CoursesResponse>;
};

// Shows the course cards + the pagination under them.
// It receives the promise (not the data) → use() waits for it,
// and <Suspense> shows <CoursesSkeleton /> until the data is ready.
export function CoursesGrid({ coursesPromise }: CoursesGridProps) {
    const { courses, totalCount, pageSize } = use(coursesPromise);

    if (courses.length === 0) {
        return (
            <Empty className="border border-dashed py-16">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <SearchX />
                    </EmptyMedia>
                    <EmptyTitle>No courses found</EmptyTitle>
                    <EmptyDescription>Try another search or remove some filters.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>

            <UrlPagination totalCount={totalCount} pageSize={pageSize} />
        </div>
    );
}
