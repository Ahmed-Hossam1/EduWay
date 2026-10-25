import { Lock, PlayCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { formatDuration, formatVideoDuration } from "@/features/courses/utils/format";
import { CourseSection } from "../types";

type CourseCurriculumProps = {
    sections: CourseSection[];
    totalLessons: number;
    totalSeconds: number;
};

// total length of one section: sum of its lessons
const getSectionSeconds = (section: CourseSection) =>
    section.lessons.reduce((total, lesson) => total + lesson.duration_seconds, 0);

export function CourseCurriculum({ sections, totalLessons, totalSeconds }: CourseCurriculumProps) {
    if (sections.length === 0) return null;

    return (
        <section aria-labelledby="curriculum-title">
            <h2 id="curriculum-title" className="text-2xl font-bold tracking-tight text-foreground">
                Course content
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
                {sections.length} sections · {totalLessons} lessons · {formatDuration(totalSeconds)} total length
            </p>

            {/* First section open by default, the user can open more than one */}
            <Accordion
                multiple
                defaultValue={[sections[0].id]}
                className="mt-5 overflow-hidden rounded-xl border border-border"
            >
                {sections.map((section) => (
                    <AccordionItem
                        key={section.id}
                        value={section.id}
                        className="border-b border-border last:border-b-0"
                    >
                        <AccordionTrigger className="bg-muted/40 px-4 py-3.5 hover:no-underline">
                            <span className="flex w-full items-center justify-between gap-4 pr-2">
                                <span className="text-sm font-semibold text-foreground">
                                    {section.position}. {section.title}
                                </span>
                                <span className="shrink-0 text-xs font-normal text-muted-foreground">
                                    {section.lessons.length} lessons · {formatDuration(getSectionSeconds(section))}
                                </span>
                            </span>
                        </AccordionTrigger>

                        <AccordionContent className="pb-0">
                            <ul className="divide-y divide-border/60">
                                {section.lessons.map((lesson) => (
                                    <li
                                        key={lesson.id}
                                        className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                                    >
                                        <span className="flex min-w-0 items-center gap-3">
                                            {/* icon if preview */}
                                            {lesson.is_preview ? (
                                                <PlayCircle className="size-4 shrink-0 text-primary" />
                                            ) : (
                                                <Lock className="size-4 shrink-0 text-muted-foreground" />
                                            )}
                                            <span className="truncate text-foreground">{lesson.title}</span>
                                            {/* lesson preview badge */}
                                            {lesson.is_preview && (
                                                <Badge variant="accent" className="shrink-0">
                                                    Preview
                                                </Badge>
                                            )}
                                        </span>
                                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                            {formatVideoDuration(lesson.duration_seconds)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}
