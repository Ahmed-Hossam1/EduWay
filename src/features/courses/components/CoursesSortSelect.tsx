"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { coursesSortOptions } from "../data"
import { useCoursesSearchParams } from "../hooks/useCoursesSearchParams"

export function CoursesSortSelect() {
    const { getValue, updateParams } = useCoursesSearchParams()

    // no sort in the URL → "popular" (same default as getCourses)
    const currentSort = getValue("sort") ?? "popular"

    return (
        <Select
            items={coursesSortOptions}
            value={currentSort}
            onValueChange={(value) => updateParams({ sort: value as string })}
        >
            <SelectTrigger aria-label="Sort courses" className="h-9 min-w-44 bg-background">
                <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
                {coursesSortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
