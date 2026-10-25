"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical, Pencil, PlayCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { cn } from "@/lib/utils";
import { useDeleteLesson } from "../../hooks/useDeleteLesson";
import { CurriculumLesson } from "../../types";
import { getLessonVideoThumbnailUrl, getLessonVideoUrl } from "../../utils";
import { LessonDialog } from "./LessonDialog";
import { LessonVideo } from "./LessonVideo";

type SortableLessonProps = {
    lesson: CurriculumLesson;
    index: number; // its place in the section (0, 1, 2...)
    sectionId: string;
};

// One lesson: the row (handle, title, free preview, video buttons, edit + delete) + the video preview under it
export function SortableLesson({ lesson, index, sectionId }: SortableLessonProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { mutate: deleteLesson, isPending: isDeleting } = useDeleteLesson();

    // group = its section (the editor reads it after the drag)
    // type = "lesson-" + the section id → a lesson can only be dropped inside ITS section
    const { ref, handleRef, isDragging } = useSortable({
        id: lesson.id,
        index,
        group: sectionId,
        type: `lesson-${sectionId}`,
        accept: `lesson-${sectionId}`,
    });

    return (
        <li
            ref={ref}
            className={cn(
                "rounded-lg border border-border bg-background px-2 py-2",
                isDragging && "opacity-50 shadow-lg",
            )}
        >
            {/* 1- The row */}
            <div className="flex items-center gap-2">
                <button
                    ref={handleRef}
                    type="button"
                    aria-label={`Drag lesson ${lesson.title}`}
                    className="flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                >
                    <GripVertical className="size-4" />
                </button>

                <PlayCircle className="size-4 shrink-0 text-muted-foreground" />
                <p className="min-w-0 flex-1 truncate text-sm">
                    <span className="text-muted-foreground">{index + 1}.</span> {lesson.title}
                </p>

                {lesson.is_preview && (
                    <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
                        Free preview
                    </Badge>
                )}
                {/* Upload video / duration + Replace + Remove */}
                <LessonVideo lesson={lesson} />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${lesson.title}`}
                    onClick={() => setDialogOpen(true)}
                >
                    <Pencil />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${lesson.title}`}
                    onClick={() => setConfirmOpen(true)}
                    className="text-muted-foreground hover:text-destructive"
                >
                    <Trash2 />
                </Button>
            </div>

            {/* 2- The video preview (a picture from the video; click → the video in a big window) */}
            {lesson.has_video && (
                <HeroVideoDialog
                    className="mt-2 ml-9 max-w-xs"
                    animationStyle="from-center"
                    videoSrc={getLessonVideoUrl(lesson.id, lesson.video_version)}
                    thumbnailSrc={getLessonVideoThumbnailUrl(lesson.id, lesson.video_version)}
                    thumbnailAlt={`Video of ${lesson.title}`}
                />
            )}

            <LessonDialog lesson={lesson} open={dialogOpen} onOpenChange={setDialogOpen} />
            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Delete this lesson?"
                description={`"${lesson.title}" will be deleted. Students lose their progress on it. This can't be undone.`}
                confirmLabel="Delete lesson"
                destructive
                isPending={isDeleting}
                onConfirm={() => deleteLesson(lesson.id, { onSuccess: () => setConfirmOpen(false) })}
            />
        </li>
    );
}
