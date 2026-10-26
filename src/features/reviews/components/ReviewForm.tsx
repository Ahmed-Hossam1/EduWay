"use client";

import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { reviewInputs } from "../data/reviewInputs";
import { reviewSchema, ReviewValues } from "../schemas/reviewSchemas";
import { StarRatingInput } from "./StarRatingInput";

type ReviewFormProps = {
    defaultValues?: ReviewValues; // editing → the current stars + text
    submitLabel: string; // "Post review", "Save"
    isPending: boolean;
    onSubmit: (values: ReviewValues) => void;
    onCancel?: () => void; // editing → a Cancel button
};

// Stars + optional text: write a new review, or edit yours
export function ReviewForm({ defaultValues, submitLabel, isPending, onSubmit, onCancel }: ReviewFormProps) {
    const { register, handleSubmit, control, formState } = useForm<ReviewValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: defaultValues ?? { rating: 0, body: "" },
    });

    // the stars are not a normal input → useController
    const { field: ratingField, fieldState: ratingState } = useController({ control, name: "rating" });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field>
                <FieldLabel>Your rating</FieldLabel>
                <StarRatingInput value={ratingField.value} onChange={ratingField.onChange} />
                <FieldError errors={[ratingState.error]} />
            </Field>

            {reviewInputs.map((input) => (
                <Textarea
                    key={input.id}
                    id={input.id}
                    {...register(input.name)}
                    label={input.label}
                    placeholder={input.placeholder}
                    errorText={formState.errors[input.name]?.message}
                    rows={4}
                />
            ))}

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" isLoading={isPending}>
                    {isPending ? "Saving..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}
