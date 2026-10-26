import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatVideoDuration } from "@/features/courses/utils/format";
import { LessonProgress, PlayerSection } from "../types";
import { getLessonHref } from "../utils";

type PlayerCurriculumProps = {
    courseSlug: string;
    courseTitle: string;
    sections: PlayerSection[];
    currentLessonId: string;
    progress: LessonProgress;
    showProgress: boolean; // only a student who owns the course has progress
};

/**
 * The list on the right: the course, the progress bar, every section with its lessons.
 *    done |  can watch |  locked (not enrolled and not a free preview) | the open lesson is highlighted
 */
export function PlayerCurriculum({
    courseSlug,
    courseTitle,
    sections,
    currentLessonId,
    progress,
    showProgress,
}: PlayerCurriculumProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
            {/* the course + the progress */}
            <div className="space-y-3 border-b border-border p-4">
                <Link href={`/courses/${courseSlug}`} className="line-clamp-2 font-bold hover:text-primary">
                    {courseTitle}
                </Link>
                {showProgress && (
                    <div className="space-y-1.5">
                        <Progress value={progress.percent} aria-label={`${progress.percent}% completed`} />
                        <p className="text-xs text-muted-foreground">
                            {progress.completed} / {progress.total} lessons · {progress.percent}%
                        </p>
                    </div>
                )}
            </div>

            {/* the sections + their lessons */}
            <div className="max-h-[70vh] overflow-y-auto">
                {sections.map((section, sectionIndex) => (
                    <div key={section.id}>
                        <p className="bg-muted/60 px-4 py-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                            Section {sectionIndex + 1}: {section.title}
                        </p>

                        <ul>
                            {section.lessons.map((lesson, lessonIndex) => {
                                const isCurrent = lesson.id === currentLessonId;
                                const Icon = !lesson.can_watch ? Lock : lesson.is_completed ? CheckCircle2 : PlayCircle;

                                const row = (
                                    <div
                                        className={cn(
                                            "flex items-start gap-3 px-4 py-3 text-sm",
                                            isCurrent && "bg-primary/10 font-semibold text-primary",
                                            !lesson.can_watch && "text-muted-foreground",
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "mt-0.5 size-4 shrink-0",
                                                lesson.is_completed && lesson.can_watch && "text-emerald-600",
                                            )}
                                        />
                                        <span className="min-w-0 flex-1">
                                            {lessonIndex + 1}. {lesson.title}
                                            {/* not enrolled → show which lessons are free */}
                                            {lesson.is_preview && !showProgress && (
                                                <span className="ml-1.5 text-xs font-normal text-primary">Preview</span>
                                            )}
                                        </span>
                                        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                                            {formatVideoDuration(lesson.duration_seconds)}
                                        </span>
                                    </div>
                                );

                                return (
                                    <li key={lesson.id} className="border-t border-border first:border-t-0">
                                        {/* a locked lesson is not a link */}
                                        {lesson.can_watch ? (
                                            <Link
                                                href={getLessonHref(courseSlug, lesson.id)}
                                                aria-current={isCurrent ? "page" : undefined}
                                                className="block hover:bg-muted/60"
                                            >
                                                {row}
                                            </Link>
                                        ) : (
                                            row
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
