import { CourseStatus } from "@/features/courses/types";

/**
 * The label + colors of each course status, in ONE place.
 * Used by the badge in each course row AND the status tabs (the active tab gets the same color).
 *   published → green   draft → yellow   archived → gray
 */
export const STATUS_BADGES: Record<CourseStatus, { label: string; className: string }> = {
    published: {
        label: "Published",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    draft: {
        label: "Draft",
        className:
            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
    },
    archived: {
        label: "Archived",
        className: "border-border bg-muted text-muted-foreground",
    },
};
