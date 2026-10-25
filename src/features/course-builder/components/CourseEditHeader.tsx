import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_BADGES } from "@/features/teacher-courses/constant";
import { CourseForEdit } from "../types";

type CourseEditHeaderProps = {
    course: CourseForEdit;
};

// The top of the edit page: back to My courses, the title, the status, the course link (it never changes)
export function CourseEditHeader({ course }: CourseEditHeaderProps) {
    const badge = STATUS_BADGES[course.status];

    return (
        <div className="space-y-3">
            <Link
                href="/teacher/courses"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="size-4" />
                My courses
            </Link>

            <div className="flex flex-wrap items-center gap-3">
                <h1 className="min-w-0 truncate text-2xl font-black tracking-tight">{course.title}</h1>
                <Badge variant="outline" className={badge.className}>
                    {badge.label}
                </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Course link: /courses/{course.slug}</p>
        </div>
    );
}
