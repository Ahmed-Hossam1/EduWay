"use client";

import { useState } from "react";
import { DragDropProvider, DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { ListTree, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { pluralize } from "@/lib/format";
import { useAddSection } from "../../hooks/useAddSection";
import { useReorderSections } from "../../hooks/useReorderSections";
import { useReorderLessons } from "../../hooks/useReorderLessons";
import { CurriculumSection } from "../../types";
import { moveItem } from "../../utils";
import { SortableSection } from "./SortableSection";
import { TitleForm } from "./TitleForm";

type CurriculumEditorProps = {
    courseId: string;
    curriculum: CurriculumSection[]; // from the server (sections + lessons by position)
};

/**
 * The Curriculum tab.
 * The list lives in useState → after a drag it changes on the screen right away,
 * then we save the new order. Saving failed → the old order comes back.
 */
export function CurriculumEditor({ courseId, curriculum }: CurriculumEditorProps) {
    const [sections, setSections] = useState<CurriculumSection[]>(curriculum);
    const [isAddingSection, setIsAddingSection] = useState<boolean>(false);

    const { mutate: addSection, isPending: isAddingPending } = useAddSection();
    const { mutate: reorderSections } = useReorderSections();
    const { mutate: reorderLessons } = useReorderLessons();

    const lessonsCount = sections.reduce((total, section) => total + section.lessons.length, 0);

    // A section moved from place "from" to place "to"
    function moveSection(from: number, to: number) {
        const oldSections = sections;
        const newSections = moveItem(sections, from, to);
        setSections(newSections);

        // send the ids in the new order
        const ids = newSections.map((section) => section.id);
        reorderSections({ courseId, ids }, { onError: () => setSections(oldSections) });
    }

    // A lesson moved inside its section
    function moveLesson(sectionId: string, from: number, to: number) {
        const section = sections.find((item) => item.id === sectionId);
        if (!section) return;

        const oldSections = sections;
        const newLessons = moveItem(section.lessons, from, to);
        setSections(sections.map((item) => (item.id === sectionId ? { ...item, lessons: newLessons } : item)));

        const ids = newLessons.map((lesson) => lesson.id);
        reorderLessons({ sectionId, ids }, { onError: () => setSections(oldSections) });
    }

    // The drag ended (a section OR a lesson)
    function handleDragEnd(event: DragEndEvent) {
        if (event.canceled) return; // Esc / dropped outside

        const { source } = event.operation;
        if (!isSortable(source)) return;

        const { initialIndex, index } = source;
        if (initialIndex === index) return; // dropped in the same place

        if (source.type === "section") {
            moveSection(initialIndex, index);
        } else {
            // a lesson: its group is the id of its section
            moveLesson(String(source.group), initialIndex, index);
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-lg font-bold">Curriculum</h2>
                <p className="text-sm text-muted-foreground">
                    {sections.length} {pluralize(sections.length, "section")} · {lessonsCount}{" "}
                    {pluralize(lessonsCount, "lesson")} — drag the handle to change the order.
                </p>
            </div>

            {sections.length === 0 ? (
                <Empty className="border border-dashed py-12">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ListTree />
                        </EmptyMedia>
                        <EmptyTitle>No sections yet</EmptyTitle>
                        <EmptyDescription>
                            Split your course into sections, then add lessons to each one.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                // ONE provider for the sections AND the lessons (handleDragEnd knows which one moved)
                <DragDropProvider onDragEnd={handleDragEnd}>
                    <ul className="space-y-4">
                        {sections.map((section, index) => (
                            <SortableSection key={section.id} section={section} index={index} />
                        ))}
                    </ul>
                </DragDropProvider>
            )}

            {/* Add a section (at the end of the course) */}
            {isAddingSection ? (
                <div className="rounded-2xl border border-dashed border-border p-3">
                    <TitleForm
                        placeholder="Section title, e.g. Getting started"
                        submitLabel="Add section"
                        isPending={isAddingPending}
                        onSubmit={(title) =>
                            addSection({ courseId, title }, { onSuccess: () => setIsAddingSection(false) })
                        }
                        onCancel={() => setIsAddingSection(false)}
                    />
                </div>
            ) : (
                <Button type="button" variant="outline" onClick={() => setIsAddingSection(true)}>
                    <Plus />
                    Add section
                </Button>
            )}
        </div>
    );
}
