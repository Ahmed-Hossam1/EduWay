import { use } from "react";
import Link from "next/link";
import { BookPlus, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { UrlPagination } from "@/components/shared/UrlPagination";
import { TeacherCoursesResponse } from "../types";
import { TeacherCourseRow } from "./TeacherCourseRow";
import { cn } from "@/lib/utils";
import { pluralize } from "@/lib/format";

type TeacherCoursesListProps = {
    coursesPromise: Promise<TeacherCoursesResponse>;
    hasFilters: boolean;
};

export function TeacherCoursesList({ coursesPromise, hasFilters }: TeacherCoursesListProps) {
    const { courses, totalCount, pageSize } = use(coursesPromise);

    // a filter is on and nothing matches
    if (courses.length === 0 && hasFilters) {
        return (
            <Empty className="border border-dashed py-16">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <SearchX />
                    </EmptyMedia>
                    <EmptyTitle>No courses match</EmptyTitle>
                    <EmptyDescription>Try another name or status.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button asChild variant="outline">
                        <Link href="/teacher/courses">Clear filters</Link>
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    // a new teacher with no courses yet
    if (courses.length === 0) {
        return (
            <Empty className="border border-dashed py-16">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <BookPlus />
                    </EmptyMedia>
                    <EmptyTitle>Create your first course</EmptyTitle>
                    <EmptyDescription>Your courses show up here, drafts and published.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button asChild>
                        <Link href="/teacher/courses/new">New course</Link>
                    </Button>
                </EmptyContent>
            </Empty>
        );
    }

    return (
        <div className="space-y-4">
            <Card className="gap-0 py-0">
                {/* the column names (desktop only: on mobile each row shows its own labels) */}
                <div
                    className={cn(
                        "hidden gap-4 bg-muted/50 px-4 py-2 text-xs text-muted-foreground md:grid",
                        "md:grid-cols-[96px_minmax(0,1fr)_96px_96px_88px]"
                    )}
                >
                    <span>Course</span>
                    <span />
                    <span>Students</span>
                    <span>Earnings</span>
                    <span className="sr-only">Actions</span>
                </div>

                <ul>
                    {courses.map((course) => (
                        <TeacherCourseRow key={course.id} course={course} />
                    ))}
                </ul>
            </Card>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <p className="shrink-0 text-xs text-muted-foreground">
                    {totalCount} {pluralize(totalCount, "course")}
                </p>
                <UrlPagination totalCount={totalCount} pageSize={pageSize} />
            </div>
        </div>
    );
}
