import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LessonPlayer } from "../types";

type LessonOverviewProps = {
    course: LessonPlayer["course"];
    lesson: LessonPlayer["lesson"];
    progress: LessonPlayer["progress"];
    showProgress: boolean; // only a student who owns the course has progress
};

// The "Overview" tab under the video: about this lesson + about the course
export function LessonOverview({ course, lesson, progress, showProgress }: LessonOverviewProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold">About this lesson</h2>
                {/* whitespace-pre-line keeps the line breaks the teacher wrote */}
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                    {lesson.description || "The instructor didn't add a description for this lesson."}
                </p>
            </div>

            <Separator />

            <div className="space-y-3">
                <h2 className="text-lg font-bold">About the course</h2>
                <p className="font-medium text-foreground">{course.title}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <BookOpen className="size-4" />
                        {progress.total} {progress.total === 1 ? "lesson" : "lessons"}
                    </span>
                    {showProgress && (
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-4" />
                            {progress.completed} done · {progress.percent}%
                        </span>
                    )}
                </div>
                <Button variant="outline" rounded="full" className="w-fit" asChild>
                    <Link href={`/courses/${course.slug}`}>
                        View course page
                        <ArrowRight />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
