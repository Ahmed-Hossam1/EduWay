"use client";

import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryRow } from "@/features/categories/types";
import { createCourseSchema, CreateCourseValues } from "../schemas/createCourseSchema";
import { useCreateCourse } from "../hooks/useCreateCourse";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type CreateCourseFormProps = {
    categories: CategoryRow[];
};

// /teacher/courses/new: only a title + a category → a draft is made → the edit page opens
export function CreateCourseForm({ categories }: CreateCourseFormProps) {
    const { mutate: createCourse, isPending } = useCreateCourse();

    const form = useForm<CreateCourseValues>({
        resolver: zodResolver(createCourseSchema),
        defaultValues: { title: "", categoryId: "" },
    });
    const { register, handleSubmit, control, formState } = form;
    const { field: categoryField, fieldState: categoryState } = useController({ control, name: "categoryId" });

    // the Select needs { value, label } items for dropdown and 
    // the value is the category id because the database link course with category using uuid not name
    const categoryItems = categories.map((category) => ({ value: category.id, label: category.name }));

    return (
        <Card className="rounded-2xl">
            <CardContent>
                <form onSubmit={handleSubmit((values) => createCourse(values))} className="space-y-6">
                    <Input
                        id="new-course-title"
                        {...register("title")}
                        label="Course title"
                        placeholder="e.g. React for Beginners"
                        helperText="You can change it later. The course link is made from this title."
                        errorText={formState.errors.title?.message}
                        maxLength={150}
                        fullWidth
                        autoFocus
                    />

                    <Field>
                        <FieldLabel htmlFor="new-course-category">Category</FieldLabel>
                        <Select
                            items={categoryItems}
                            value={categoryField.value || null}
                            onValueChange={(value) => categoryField.onChange(value ?? "")}
                        >
                            <SelectTrigger id="new-course-category" className="h-10 w-full">
                                <SelectValue placeholder="Choose a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryItems.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FieldError errors={[categoryState.error]} />
                    </Field>

                    <Button type="submit" size="lg" rounded="xl" className="h-11 w-full" isLoading={isPending}>
                        {isPending ? (
                            "Creating..."
                        ) : (
                            <>
                                Create course
                                <ArrowRight />
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
