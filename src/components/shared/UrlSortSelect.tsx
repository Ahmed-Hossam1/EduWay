"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { cn } from "@/lib/utils";

type SortOption = {
    value: string;
    label: string;
};

type UrlSortSelectProps = {
    options: SortOption[];
    defaultValue: string; // the value when ?sort is not in the URL (same default as the page schema)
    label: string; // for screen readers: "Sort courses"
    className?: string;
};

/**
 * A sort dropdown that reads / writes ?sort=... in the URL (works on any list page).
 * Changing it goes back to page 1 (updateParams removes ?page).
 *
 *   <UrlSortSelect options={coursesSortOptions} defaultValue={DEFAULT_COURSES_SORT} label="Sort courses" />
 */
export function UrlSortSelect({ options, defaultValue, label, className }: UrlSortSelectProps) {
    const { getValue, updateParams } = useUrlSearchParams();
    const currentSort = getValue("sort") ?? defaultValue;

    return (
        <Select items={options} value={currentSort} onValueChange={(value) => updateParams({ sort: value as string })}>
            <SelectTrigger aria-label={label} className={cn("bg-background", className)}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
