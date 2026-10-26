"use client";

import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCompleteLesson } from "../hooks/useCompleteLesson";
import { CurrentLesson } from "../types";
import { getLessonHref } from "../utils";

type LessonInfoProps = {
    lesson: CurrentLesson;
    courseSlug: string;
    previousLessonId: string | null;
    nextLessonId: string | null;
    canSaveProgress: boolean; // only a student who owns the course has progress
};

// Under the video: the title, "Mark as complete", previous / next, the description
export function LessonInfo({ lesson, courseSlug, previousLessonId, nextLessonId, canSaveProgress }: LessonInfoProps) {
    const { mutate: completeLesson, isPending } = useCompleteLesson();

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{lesson.title}</h1>

                {canSaveProgress && (
                    <Button
                        variant={lesson.is_completed ? "outline" : "default"}
                        isLoading={isPending}
                        onClick={() => completeLesson({ lessonId: lesson.id, completed: !lesson.is_completed })}
                    >
                        {isPending ? (
                            "Saving..."
                        ) : lesson.is_completed ? (
                            <>
                                <CheckCircle2 className="text-emerald-600" />
                                Completed
                            </>
                        ) : (
                            <>
                                <Circle />
                                Mark as complete
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* previous / next lesson */}
            <div className="flex items-center justify-between gap-2">
                {previousLessonId ? (
                    <Button variant="outline" asChild>
                        <Link href={getLessonHref(courseSlug, previousLessonId)}>
                            <ChevronLeft />
                            Previous lesson
                        </Link>
                    </Button>
                ) : (
                    <span />
                )}
                {nextLessonId && (
                    <Button variant="outline" asChild>
                        <Link href={getLessonHref(courseSlug, nextLessonId)}>
                            Next lesson
                            <ChevronRight />
                        </Link>
                    </Button>
                )}
            </div>

            {lesson.description && (
                <>
                    <Separator />
                    <div>
                        <h2 className="text-lg font-bold">About this lesson</h2>
                        {/* whitespace-pre-line keeps the line breaks the teacher wrote */}
                        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                            {lesson.description}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
