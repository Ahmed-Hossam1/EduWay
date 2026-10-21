import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TopCourse } from "../../types";
import { formatMoney } from "../../utils/chart";

type TopCoursesFanProps = {
    topCoursesPromise: Promise<TopCourse[]>;
};

/**
 * The 3 best-selling courses as stacked cards.
 * Hover the stack → the cards fan out (CSS only: "group" on the parent, "group-hover:" on each card).
 *   card 1 → left + turn left, card 2 → up, card 3 → right + turn right
 */
const FAN_POSITIONS = [
    "z-10 group-hover:-translate-x-[45%] group-hover:translate-y-3 group-hover:-rotate-12",
    "z-20 translate-y-1 group-hover:-translate-y-3",
    "z-30 translate-y-2 group-hover:translate-x-[45%] group-hover:translate-y-3 group-hover:rotate-12",
];

export function TopCoursesFan({ topCoursesPromise }: TopCoursesFanProps) {
    const courses = use(topCoursesPromise); // waits inside the <Suspense> of TeacherOverview

    // no courses yet → a short message instead of an empty stack
    if (courses.length === 0) {
        return (
            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 sm:col-span-2">
                <CardHeader>
                    <CardTitle className="font-bold">Top courses</CardTitle>
                    <CardDescription>Create your first course to see it here.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 sm:col-span-2">
            <CardContent className="grid gap-4 sm:grid-cols-[1fr_1.3fr] sm:items-center">
                <div>
                    {/* header inside the left column (the stack is on the right) */}
                    <CardHeader className="px-0">
                        <CardTitle className="font-bold">Top courses</CardTitle>
                        <CardDescription className="text-xs">Your 3 best-selling courses. Hover to see them all.</CardDescription>
                    </CardHeader>

                    <ul className="mt-3 space-y-1 text-xs">
                        {courses.map((course, index) => (
                            <li key={course.slug} className="flex justify-between gap-2">
                                <span className="truncate text-muted-foreground">
                                    {index + 1}. {course.title}
                                </span>
                                <span className="shrink-0 font-semibold">{formatMoney(course.earnings)}</span>
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/teacher/courses"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                        All courses <ArrowRight className="size-3.5" />
                    </Link>
                </div>

                {/* the stack (group = the hover area) */}
                <div className="group relative mx-auto h-36 w-44 cursor-pointer">
                    {courses.map((course, index) => (
                        <div
                            key={course.slug}
                            className={cn(
                                "absolute inset-0 overflow-hidden rounded-xl bg-card shadow-lg ring-1 ring-border transition-transform duration-500 ease-out",
                                FAN_POSITIONS[index],
                            )}
                        >
                            <Image src={course.thumbnailUrl} alt={course.title} fill sizes="176px" className="object-cover" />
                            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-2 text-white">
                                <p className="line-clamp-1 text-[11px] font-semibold">{course.title}</p>
                                <p className="text-[10px] text-white/80">{course.students} students</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function TopCoursesFanSkeleton() {
    return (
        <Card className="sm:col-span-2">
            <CardContent className="grid gap-4 sm:grid-cols-[1fr_1.3fr] sm:items-center">
                <div>
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="mt-2 h-3 w-48" />
                    <div className="mt-3 space-y-2">
                        {[1, 2, 3].map((item) => (
                            <Skeleton key={item} className="h-3 w-full" />
                        ))}
                    </div>
                </div>
                <Skeleton className="mx-auto h-36 w-44 rounded-xl" />
            </CardContent>
        </Card>
    );
}
