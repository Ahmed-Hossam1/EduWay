"use client";

import { useState } from "react";
import { useController } from "react-hook-form";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CourseDetailsValues } from "../../schemas/courseDetailsSchema";
import { PrerequisiteOption } from "../../types";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { MAX_PREREQUISITES } from "../../constants";

type PrerequisitesFieldProps = {
    options: PrerequisiteOption[]; // the published courses (from the server)
};

// "Finish these courses first" (optional): a checkbox list of the published courses + a search box
export function PrerequisitesField({ options }: PrerequisitesFieldProps) {
    const { field, fieldState } = useController<CourseDetailsValues, "prerequisiteIds">({ name: "prerequisiteIds" });
    const selectedIds = field.value;
    const isFull = selectedIds.length >= MAX_PREREQUISITES;

    // the text of the search box (only filters the list on the screen)
    const [search, setSearch] = useState("");
    const visibleOptions = options.filter((option) => option.title.toLowerCase().includes(search.trim().toLowerCase()));

    const toggle = (courseId: string, checked: boolean) => {
        if (checked) {
            if (!isFull) field.onChange([...selectedIds, courseId]);
            return;
        }
        field.onChange(selectedIds.filter((id) => id !== courseId));
    };

    return (
        <Field>
            <FieldLabel>Prerequisite courses</FieldLabel>
            <FieldDescription>{`Optional — courses students should finish first (up to ${MAX_PREREQUISITES}).`}</FieldDescription>

            <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses"
                aria-label="Search courses"
                leftIcon={<Search className="size-4" />}
                fullWidth
            />

            <ul className="max-h-60 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
                {visibleOptions.length === 0 && (
                    <li className="px-2 py-3 text-center text-sm text-muted-foreground">No courses found</li>
                )}

                {visibleOptions.map((option) => {
                    const isChecked = selectedIds.includes(option.id);

                    return (
                        <li key={option.id}>
                            <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60">
                                <Checkbox
                                    checked={isChecked}
                                    disabled={!isChecked && isFull}
                                    onCheckedChange={(checked) => toggle(option.id, checked)}
                                />
                                <span className="line-clamp-1">{option.title}</span>
                            </label>
                        </li>
                    );
                })}
            </ul>

            <FieldError errors={[fieldState.error]} />
        </Field>
    );
}
