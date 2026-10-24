"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { instructorsSortOptions } from "../data";

export function InstructorsSortSelect() {
    const { getValue, updateParams } = useUrlSearchParams();

    // no sort in the URL → "students" (same default as getInstructors)
    const currentSort = getValue("sort") ?? "students";

    return (
        <Select
            items={instructorsSortOptions}
            value={currentSort}
            onValueChange={(value) => updateParams({ sort: value as string })}
        >
            <SelectTrigger aria-label="Sort instructors" className="h-9 min-w-40 bg-background">
                <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
                {instructorsSortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
