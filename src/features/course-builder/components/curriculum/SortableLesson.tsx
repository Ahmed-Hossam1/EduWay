"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical, MoreHorizontal, Pencil, PlayCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { cn } from "@/lib/utils";
import { useDeleteLesson } from "../../hooks/useDeleteLesson";
import { CurriculumLesson } from "../../types";
import { LessonDialog } from "./LessonDialog";
import { LessonVideo } from "./LessonVideo";

type SortableLessonProps = {
    lesson: CurriculumLesson;
    index: number; // its place in the section (0, 1, 2...)
    sectionId: string;
};

// One lesson: the row (handle, title, free preview, the lesson "..." menu) + its video box under it
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
            className={cn("rounded-lg border border-border bg-background p-2", isDragging && "opacity-50 shadow-lg")}
        >
            {/* 1- The lesson row */}
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
                <p className="min-w-0 flex-1 truncate text-sm font-medium">
                    <span className="text-muted-foreground">{index + 1}.</span> {lesson.title}
                </p>

                {lesson.is_preview && (
                    <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
                        Free preview
                    </Badge>
                )}

                {/* the lesson actions, with words (the video ones are in the video box) */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        aria-label={`Actions for lesson ${lesson.title}`}
                        className="flex size-7 cursor-pointer items-center justify-center rounded-lg outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring aria-expanded:bg-muted"
                    >
                        <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                            <Pencil />
                            Edit lesson
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
                            <Trash2 />
                            Delete lesson
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 2- The video box: upload / preview + Replace / Remove */}
            <LessonVideo lesson={lesson} />

            <LessonDialog lesson={lesson} open={dialogOpen} onOpenChange={setDialogOpen} />
            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Delete this lesson?"
                description={`"${lesson.title}" and its video will be deleted. Students lose their progress on it. This can't be undone.`}
                confirmLabel="Delete lesson"
                destructive
                isPending={isDeleting}
                onConfirm={() => deleteLesson(lesson.id, { onSuccess: () => setConfirmOpen(false) })}
            />
        </li>
    );
}
