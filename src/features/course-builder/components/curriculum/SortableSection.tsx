"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { cn } from "@/lib/utils";
import { pluralize } from "@/lib/format";
import { useRenameSection } from "../../hooks/useRenameSection";
import { useDeleteSection } from "../../hooks/useDeleteSection";
import { useAddLesson } from "../../hooks/useAddLesson";
import { CurriculumSection } from "../../types";
import { SortableLesson } from "./SortableLesson";
import { TitleForm } from "./TitleForm";

type SortableSectionProps = {
    section: CurriculumSection;
    index: number; // its place in the course (0, 1, 2...)
};

// One section card: handle + title (rename / delete), its lessons, "Add lesson"
export function SortableSection({ section, index }: SortableSectionProps) {
    const [isRenaming, setIsRenaming] = useState(false);
    const [isAddingLesson, setIsAddingLesson] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { mutate: renameSection, isPending: isRenamingPending } = useRenameSection();
    const { mutate: deleteSection, isPending: isDeleting } = useDeleteSection();
    const { mutate: addLesson, isPending: isAddingPending } = useAddLesson();

    // ref = the card that moves | handleRef = the only part you can grab (the buttons inside stay clickable)
    // type "section" → a section can only be dropped between sections
    const { ref, handleRef, isDragging } = useSortable({
        id: section.id,
        index,
        type: "section",
        accept: "section",
    });

    const lessonsCount = section.lessons.length;

    return (
        <li ref={ref} className={cn("rounded-2xl border border-border bg-card", isDragging && "opacity-50 shadow-xl")}>
            {/* 1- Header */}
            <div className="flex items-center gap-2 border-b border-border p-3">
                <button
                    ref={handleRef}
                    type="button"
                    aria-label={`Drag section ${section.title}`}
                    className="flex size-8 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                >
                    <GripVertical className="size-4" />
                </button>

                {isRenaming ? (
                    <div className="flex-1">
                        <TitleForm
                            defaultTitle={section.title}
                            placeholder="Section title"
                            submitLabel="Save"
                            isPending={isRenamingPending}
                            onSubmit={(title) =>
                                renameSection(
                                    { sectionId: section.id, title },
                                    { onSuccess: () => setIsRenaming(false) },
                                )
                            }
                            onCancel={() => setIsRenaming(false)}
                        />
                    </div>
                ) : (
                    <>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">
                                <span className="text-muted-foreground">Section {index + 1}:</span> {section.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {lessonsCount} {pluralize(lessonsCount, "lesson")}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Rename ${section.title}`}
                            onClick={() => setIsRenaming(true)}
                        >
                            <Pencil />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Delete ${section.title}`}
                            onClick={() => setConfirmOpen(true)}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 />
                        </Button>
                    </>
                )}
            </div>

            {/* 2- The lessons */}
            <div className="space-y-3 p-3">
                {lessonsCount === 0 ? (
                    <p className="rounded-lg border border-dashed border-border py-4 text-center text-sm text-muted-foreground">
                        No lessons in this section yet
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {section.lessons.map((lesson, lessonIndex) => (
                            <SortableLesson
                                key={lesson.id}
                                lesson={lesson}
                                index={lessonIndex}
                                sectionId={section.id}
                            />
                        ))}
                    </ul>
                )}

                {/* 3- Add a lesson */}
                {isAddingLesson ? (
                    <TitleForm
                        placeholder="Lesson title"
                        submitLabel="Add lesson"
                        isPending={isAddingPending}
                        onSubmit={(title) =>
                            addLesson({ sectionId: section.id, title }, { onSuccess: () => setIsAddingLesson(false) })
                        }
                        onCancel={() => setIsAddingLesson(false)}
                    />

                ) : (
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingLesson(true)}>
                        <Plus />
                        Add lesson
                    </Button>
                )}
            </div>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Delete this section?"
                description={`"${section.title}" and its ${lessonsCount} ${pluralize(lessonsCount, "lesson")} will be deleted. This can't be undone.`}
                confirmLabel="Delete section"
                destructive
                isPending={isDeleting}
                onConfirm={() => deleteSection(section.id, { onSuccess: () => setConfirmOpen(false) })}
            />
        </li>
    );
}
