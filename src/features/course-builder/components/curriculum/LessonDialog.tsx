"use client";

import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { lessonInputs } from "../../data/curriculumInputs";
import { lessonSchema, LessonValues } from "../../schemas/curriculumSchemas";
import { useUpdateLesson } from "../../hooks/useUpdateLesson";
import { CurriculumLesson } from "../../types";

type LessonDialogProps = {
    lesson: CurriculumLesson;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

// Edit one lesson: title, description, free preview (the video comes later)
export function LessonDialog({ lesson, open, onOpenChange }: LessonDialogProps) {
    const { mutate: updateLesson, isPending } = useUpdateLesson();

    const form = useForm<LessonValues>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            title: lesson.title,
            description: lesson.description ?? "",
            isPreview: lesson.is_preview,
        },
    });
    const { register, handleSubmit, control, formState } = form;
    const { field: previewField } = useController({ control, name: "isPreview" });

    const onSubmit = (values: LessonValues) => {
        updateLesson({ lessonId: lesson.id, values }, { onSuccess: () => onOpenChange(false) });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit lesson</DialogTitle>
                    <DialogDescription>The video is uploaded from the lesson row.</DialogDescription>
                </DialogHeader>

                <form id={`lesson-form-${lesson.id}`} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* title + description: from data/curriculumInputs */}
                    {lessonInputs.map((input) =>
                        input.type === "textarea" ? (
                            <Textarea
                                key={input.id}
                                id={input.id}
                                {...register(input.name)}
                                label={input.label}
                                placeholder={input.placeholder}
                                errorText={formState.errors[input.name]?.message}
                                rows={4}
                            />
                        ) : (
                            <Input
                                key={input.id}
                                id={input.id}
                                {...register(input.name)}
                                type={input.type}
                                label={input.label}
                                placeholder={input.placeholder}
                                errorText={formState.errors[input.name]?.message}
                                fullWidth
                            />
                        ),
                    )}

                    <Field orientation="horizontal">
                        <Checkbox
                            id={`lesson-preview-${lesson.id}`}
                            checked={previewField.value}
                            onCheckedChange={(checked) => previewField.onChange(checked)}
                        />
                        <FieldContent>
                            <FieldLabel htmlFor={`lesson-preview-${lesson.id}`}>Free preview</FieldLabel>
                            <FieldDescription>Anyone can watch this lesson, even before they enroll.</FieldDescription>
                        </FieldContent>
                    </Field>
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    {/* form= → this button submits the form above (it is outside the <form>) */}
                    <Button type="submit" form={`lesson-form-${lesson.id}`} isLoading={isPending}>
                        {isPending ? "Saving..." : "Save lesson"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
