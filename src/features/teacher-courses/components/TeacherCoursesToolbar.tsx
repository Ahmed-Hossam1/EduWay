"use client";

import { Button } from "@/components/ui/button";
import { UrlSearchInput } from "@/components/shared/UrlSearchInput";
import { UrlSortSelect } from "@/components/shared/UrlSortSelect";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { cn } from "@/lib/utils";
import { STATUS_BADGES } from "../constant";
import { teacherCoursesSortOptions, teacherCoursesStatusTabs } from "../data";
import { DEFAULT_TEACHER_COURSES_SORT, DEFAULT_TEACHER_COURSES_STATUS } from "../schemas/teacherCoursesQuerySchema";

// Status tabs + search + sort. Everything lives in the URL (?status=draft&q=react&sort=students)
export function TeacherCoursesToolbar() {
    const { getValue, updateParams } = useUrlSearchParams();

    // nothing in the URL the defaults (same as teacherCoursesQuerySchema)
    const currentStatus = getValue("status") ?? DEFAULT_TEACHER_COURSES_STATUS;

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-1" role="tablist" aria-label="Filter by status">
                {teacherCoursesStatusTabs.map((tab) => {
                    const isActive = tab.value === currentStatus;
                    // "all" has no status color → the normal gray tab
                    const activeColor = tab.value === "all" ? "" : STATUS_BADGES[tab.value].className;

                    return (
                        <Button
                            key={tab.value}
                            role="tab"
                            aria-selected={isActive}
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(isActive && activeColor)}
                            // "all" is the default → no status in the URL
                            onClick={() => updateParams({ status: tab.value === "all" ? null : tab.value })}
                        >
                            {tab.label}
                        </Button>
                    );
                })}
            </div>

            <div className="flex gap-2">
                <div className="min-w-0 flex-1 md:w-64 md:flex-none">
                    <UrlSearchInput placeholder="Search your courses" />
                </div>

                <UrlSortSelect
                    options={teacherCoursesSortOptions}
                    defaultValue={DEFAULT_TEACHER_COURSES_SORT}
                    label="Sort courses"
                    className="h-10 min-w-36"
                />
            </div>
        </div>
    );
}
