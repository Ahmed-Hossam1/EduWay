"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UrlSearchInput } from "@/components/shared/UrlSearchInput";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { cn } from "@/lib/utils";
import { STATUS_BADGES } from "../constant";
import { teacherCoursesSortOptions, teacherCoursesStatusTabs } from "../data";

// Status tabs + search + sort. Everything lives in the URL (?status=draft&q=react&sort=students)
export function TeacherCoursesToolbar() {
    const { getValue, updateParams } = useUrlSearchParams();

    // nothing in the URL the defaults (same as teacherCoursesQuerySchema)
    const currentStatus = getValue("status") ?? "all";
    const currentSort = getValue("sort") ?? "newest";

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

                <Select
                    items={teacherCoursesSortOptions}
                    value={currentSort}
                    onValueChange={(value) => updateParams({ sort: value as string })}
                >
                    <SelectTrigger aria-label="Sort courses" className="h-10 min-w-36 bg-background">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                        {teacherCoursesSortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
