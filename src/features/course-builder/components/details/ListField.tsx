"use client";

import { useController, useFormState } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseDetailsValues } from "../../schemas/courseDetailsSchema";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { MAX_LIST_ITEMS } from "../../constants";

type ListFieldProps = {
    name: "learningOutcomes" | "requirements";
    label: string;
    hint: string;
    placeholder: string;
};

/**
 * A list of short lines: "What you'll learn" and "Requirements".
 * Every line is an input; "Add a line" adds an empty one (empty lines are not saved).
 */
export function ListField({ name, label, hint, placeholder }: ListFieldProps) {
    const { field, fieldState } = useController<CourseDetailsValues, typeof name>({ name });
    const { errors } = useFormState<CourseDetailsValues>({ name });
    const lines = field.value;

    const changeLine = (index: number, text: string) => {
        field.onChange(lines.map((line, i) => (i === index ? text : line)));
    };

    const removeLine = (index: number) => {
        field.onChange(lines.filter((_, i) => i !== index));
    };

    const addLine = () => {
        field.onChange([...lines, ""]);
    };

    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>
            <FieldDescription>{hint}</FieldDescription>

            <ul className="space-y-2">
                {lines.map((line, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <Input
                            value={line}
                            onChange={(event) => changeLine(index, event.target.value)}
                            placeholder={placeholder}
                            aria-label={`${label} ${index + 1}`}
                            errorText={errors[name]?.[index]?.message}
                            maxLength={160}
                            fullWidth
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Remove line ${index + 1}`}
                            onClick={() => removeLine(index)}
                            className="mt-0.5 shrink-0 text-muted-foreground hover:text-destructive"
                        >
                            <X />
                        </Button>
                    </li>
                ))}
            </ul>

            <Button type="button" variant="outline" size="sm" onClick={addLine} disabled={lines.length >= MAX_LIST_ITEMS}>
                <Plus />
                Add a line
            </Button>

            <FieldError errors={[fieldState.error]} />
        </Field>
    );
}
