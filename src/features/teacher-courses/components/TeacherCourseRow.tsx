import Image from "next/image";
import Link from "next/link";
import { ImageOff, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/features/courses/utils/format";
import { formatMoney } from "@/features/teacher-dashboard/utils/chart";
import { STATUS_BADGES } from "../constant";
import { TeacherCourse } from "../types";
import { getDraftHint } from "../utils/getDraftHint";
import { TeacherCourseActions } from "./TeacherCourseActions";

type TeacherCourseRowProps = {
    course: TeacherCourse;
};

// One course in the list: thumbnail, title, numbers, then Edit / Continue + the "..." menu
export function TeacherCourseRow({ course }: TeacherCourseRowProps) {
    const isDraft = course.status === "draft";
    const badge = STATUS_BADGES[course.status];
    // TODO: the edit course page comes later
    const editHref = `/teacher/courses/${course.id}/edit`;

    return (
        <li
            className={cn(
                "grid grid-cols-[72px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-t border-border px-4 py-3 first:border-t-0",
                "md:grid-cols-[96px_minmax(0,1fr)_96px_96px_88px]"

            )}
        >
            {/* Thumbnail (a dashed box when the draft has none yet) */}
            <div
                className={cn(
                    "relative aspect-16/10 overflow-hidden rounded-lg bg-muted",
                    !course.thumbnail_url && "border border-dashed border-border",
                )}
            >
                {course.thumbnail_url ? (
                    <Image src={course.thumbnail_url} alt={course.title} fill sizes="96px" className="object-cover" />
                ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                        <ImageOff className="size-5" />
                    </div>
                )}
            </div>

            {/* Title + status + details */}
            <div className="min-w-0">
                <p className="truncate font-semibold">{course.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <Badge variant="outline" className={badge.className}>
                        {badge.label}
                    </Badge>
                    {isDraft ? (
                        <span>{getDraftHint(course)}</span>
                    ) : (
                        <span>
                            {course.lessons_count} lessons · {formatPrice(course.price, course.currency)}
                        </span>
                    )}
                </div>
                {/* mobile only: the numbers (on desktop they have their own columns) */}
                {!isDraft && (
                    <p className="mt-1 text-xs text-muted-foreground md:hidden">
                        {course.students_count} students · {formatMoney(course.earnings)}
                    </p>
                )}
            </div>

            {/* Students (+ new this week) */}
            <div className="hidden md:block">
                <p className="text-sm font-semibold">{isDraft ? "—" : course.students_count.toLocaleString("en-US")}</p>
                {course.newStudentsThisWeek > 0 && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        +{course.newStudentsThisWeek} this week
                    </p>
                )}
            </div>

            {/* Earnings */}
            <p className="hidden text-sm font-semibold md:block">{isDraft ? "—" : formatMoney(course.earnings)}</p>

            {/* Actions: a draft continues where it stopped, a published course gets edited */}
            <div className="col-span-2 flex items-center justify-end gap-1 md:col-span-1">
                {isDraft ? (
                    <Button asChild variant="outline" size="sm">
                        <Link href={editHref}>Continue</Link>
                    </Button>
                ) : (
                    <Button asChild variant="ghost" size="icon" aria-label={`Edit ${course.title}`}>
                        <Link href={editHref}>
                            <Pencil />
                        </Link>
                    </Button>
                )}
                <TeacherCourseActions
                    courseId={course.id}
                    courseTitle={course.title}
                    courseSlug={course.slug}
                    status={course.status}
                />
            </div>
        </li>
    );
}
