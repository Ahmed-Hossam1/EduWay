import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getInstructorName } from "@/features/courses/utils/format";
import { CourseThumbnail } from "@/features/courses/components/CourseThumbnail";
import { getCourseLearnHref } from "@/features/learn/utils";
import { EnrolledCourse } from "../types";

type MyCourseCardProps = {
    enrolledCourse: EnrolledCourse;
};

// One course on "My courses": thumbnail · title · instructor · progress bar · Start / Continue
export function MyCourseCard({ enrolledCourse }: MyCourseCardProps) {
    const { course, status, completedLessons, progressPercent } = enrolledCourse;
    const isCompleted = status === "completed" || progressPercent === 100;
    const hasStarted = completedLessons > 0;

    return (
        <Card className="group pt-0">
            <Link href={`/courses/${course.slug}`} className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                <CourseThumbnail
                    src={course.thumbnail_url}
                    alt={course.title}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    zoomOnHover
                    iconClassName="size-8"
                />
                {isCompleted && (
                    <Badge variant="success" className="absolute top-2.5 left-2.5 h-auto gap-1 px-2.5 py-0.5">
                        <CheckCircle2 />
                        Completed
                    </Badge>
                )}
            </Link>

            <CardContent className="flex flex-1 flex-col gap-1.5">
                <Link
                    href={`/courses/${course.slug}`}
                    className="line-clamp-2 text-sm font-bold text-foreground transition-colors group-hover:text-primary"
                >
                    {course.title}
                </Link>
                <p className="text-xs text-muted-foreground">By {getInstructorName(course.instructor)}</p>

                {/* Progress (the lessons marked as done in the player) */}
                <div className="mt-auto space-y-1.5 pt-3">
                    <Progress value={progressPercent} aria-label={`${progressPercent}% completed`} />
                    <p className="text-xs text-muted-foreground">
                        {completedLessons} / {course.lessons_count} lessons · {progressPercent}%
                    </p>
                </div>
            </CardContent>

            <CardFooter>
                {/* /learn/[slug] opens the first lesson not done yet */}
                <Button variant={hasStarted ? "default" : "outline"} rounded="lg" className="w-full" asChild>
                    <Link href={getCourseLearnHref(course.slug)}>
                        {isCompleted ? "Review course" : hasStarted ? "Continue learning" : "Start learning"}
                        <ArrowRight />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
