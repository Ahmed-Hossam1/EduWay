"use client";

import { useController } from "react-hook-form";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryRow } from "@/features/categories/types";
import { CourseDetailsValues } from "../../schemas/courseDetailsSchema";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

type CategoriesFieldProps = {
    categories: CategoryRow[]; // from the database
};

// Choose the categories of the course (at least one; click again to remove). The FIRST one by name is the main one.
export function CategoriesField({ categories }: CategoriesFieldProps) {
    const { field, fieldState } = useController<CourseDetailsValues, "categoryIds">({ name: "categoryIds" });
    const selectedIds = field.value;

    const toggle = (categoryId: string) => {
        if (selectedIds.includes(categoryId)) {
            field.onChange(selectedIds.filter((id) => id !== categoryId));
            return;
        }
        field.onChange([...selectedIds, categoryId]);
    };

    return (
        <Field>
            <FieldLabel>Categories</FieldLabel>
            <FieldDescription>Choose every category that fits your course.</FieldDescription>

            <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                    const isSelected = selectedIds.includes(category.id);

                    // chosen → filled (default) | not chosen → outline
                    return (
                        <Button
                            key={category.id}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            rounded="full"
                            aria-pressed={isSelected}
                            onClick={() => toggle(category.id)}
                        >
                            {isSelected && <Check />}
                            {category.name}
                        </Button>
                    );
                })}
            </div>

            <FieldError errors={[fieldState.error]} />
        </Field>
    );
}
