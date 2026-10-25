"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CategoryRow } from "@/features/categories/types";
import { courseLevelOptions } from "@/features/courses/data";
import { getCourseLevelLabel } from "@/features/courses/utils/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { FormProvider, useController, useForm } from "react-hook-form";
import { COURSE_LANGUAGES } from "../../constants";
import { useUpdateCourseDetails } from "../../hooks/useUpdateCourseDetails";
import { courseDetailsSchema, CourseDetailsValues } from "../../schemas/courseDetailsSchema";
import { CourseForEdit, PrerequisiteOption } from "../../types";
import { basicInfoInputs } from "../../data/detailsInputs";
import { Field, FieldLabel } from "@/components/ui/field";
import { CategoriesField } from "./CategoriesField";
import { ListField } from "./ListField";
import { PrerequisitesField } from "./PrerequisitesField";
import { TagsField } from "./TagsField";
import { ThumbnailField } from "./ThumbnailField";
import { getDefaultValues } from "../../utils";

type CourseDetailsFormProps = {
    course: CourseForEdit;
    categories: CategoryRow[];
    prerequisiteOptions: PrerequisiteOption[];
};


// The Details tab: everything about the course except the price. One "Save" for the whole tab.
export function CourseDetailsForm({ course, categories, prerequisiteOptions }: CourseDetailsFormProps) {
    const { mutate: saveDetails, isPending } = useUpdateCourseDetails();

    const form = useForm<CourseDetailsValues>({
        resolver: zodResolver(courseDetailsSchema),
        defaultValues: getDefaultValues(course),
    });
    const { register, handleSubmit, control, formState, reset } = form;

    // the 2 selects (a Select is not a normal input → useController)
    const { field: languageField } = useController({ control, name: "language" });
    const { field: levelField } = useController({ control, name: "level" });

    const onSubmit = (values: CourseDetailsValues) => {
        // saved → these values are the new "saved" state (the Save button turns off until the next change)
        saveDetails({ courseId: course.id, values }, { onSuccess: () => reset(values) });
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 1- The basics */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Basic information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* title, short description, description: from data/detailsInputs */}
                        {basicInfoInputs.map((input) =>
                            input.type === "textarea" ? (
                                <Textarea
                                    key={input.id}
                                    id={input.id}
                                    {...register(input.name)}
                                    label={input.label}
                                    placeholder={input.placeholder}
                                    errorText={formState.errors[input.name]?.message}
                                    rows={8}
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
                        <ThumbnailField />
                    </CardContent>
                </Card>

                {/* 2- Language, level, categories, tags */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Course info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="course-language">Language</FieldLabel>
                                <Select value={languageField.value} onValueChange={languageField.onChange}>
                                    <SelectTrigger id="course-language" className="h-10 w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COURSE_LANGUAGES.map((language) => (
                                            <SelectItem key={language} value={language}>
                                                {language}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="course-level">Level</FieldLabel>
                                <Select
                                    value={levelField.value}
                                    onValueChange={levelField.onChange}
                                    itemToStringLabel={getCourseLevelLabel}
                                >
                                    <SelectTrigger id="course-level" className="h-10 w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courseLevelOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>

                        <CategoriesField categories={categories} />
                        <TagsField />
                    </CardContent>
                </Card>

                {/* 3- What students get + what they need */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Students</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <ListField
                            name="learningOutcomes"
                            label="What you'll learn"
                            hint="The skills students get from this course (one per line)."
                            placeholder="e.g. Build components with React hooks"
                        />
                        <ListField
                            name="requirements"
                            label="Requirements"
                            hint="What students should know before they start (optional)."
                            placeholder="e.g. Basic HTML and CSS"
                        />
                        <PrerequisitesField options={prerequisiteOptions} />
                    </CardContent>
                </Card>

                {/* Save: stays at the bottom of the screen while scrolling */}
                <div className="sticky bottom-0 z-10 -mx-1 flex items-center justify-end gap-3 border-t border-border bg-background/95 px-1 py-3 backdrop-blur">
                    {formState.isDirty && <span className="text-xs text-muted-foreground">You have unsaved changes</span>}
                    <Button type="submit" size="lg" rounded="xl" isLoading={isPending} disabled={!formState.isDirty}>
                        {isPending ? (
                            "Saving..."
                        ) : (
                            <>
                                <Save />
                                Save details
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
