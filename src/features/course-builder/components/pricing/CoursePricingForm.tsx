"use client";

import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { MIN_PAID_PRICE } from "../../constants";
import { coursePricingSchema, CoursePricingValues } from "../../schemas/coursePricingSchema";
import { useUpdateCoursePricing } from "../../hooks/useUpdateCoursePricing";
import { CourseForEdit } from "../../types";

type CoursePricingFormProps = {
    course: CourseForEdit;
};

const PRICE_TYPES = [
    { value: "free", label: "Free", description: "Anyone can enroll for free." },
    { value: "paid", label: "Paid", description: "Students pay once with Stripe." },
] as const;

// The Pricing tab: free or paid + the price (USD for now). price 0 = free.
export function CoursePricingForm({ course }: CoursePricingFormProps) {
    const { mutate: savePricing, isPending } = useUpdateCoursePricing();

    const form = useForm<CoursePricingValues>({
        resolver: zodResolver(coursePricingSchema),
        defaultValues: { price: course.price, currency: "USD" },
    });
    const { register, handleSubmit, control, formState, reset } = form;
    const { field: priceField } = useController({ control, name: "price" });

    const isFree = priceField.value === 0;

    // Free → price 0 | Paid → start from the lowest paid price (the teacher changes it)
    const changePriceType = (type: string) => {
        priceField.onChange(type === "free" ? 0 : MIN_PAID_PRICE);
    };

    const onSubmit = (values: CoursePricingValues) => {
        savePricing({ courseId: course.id, values }, { onSuccess: () => reset(values) });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-base font-bold">Price</CardTitle>
                    {course.students_count > 0 && (
                        <p className="text-xs text-muted-foreground">
                            A new price is only for new students. Students who already enrolled keep their access.
                        </p>
                    )}
                </CardHeader>

                <CardContent className="space-y-6">
                    <RadioGroup
                        value={isFree ? "free" : "paid"}
                        onValueChange={(value) => changePriceType(value as string)}
                        className="grid gap-3 sm:grid-cols-2"
                    >
                        {PRICE_TYPES.map((type) => {
                            const isSelected = (isFree ? "free" : "paid") === type.value;

                            return (
                                <label
                                    key={type.value}
                                    className={cn(
                                        "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                                        isSelected ? "border-primary bg-accent/50" : "border-border hover:border-primary/40",
                                    )}
                                >
                                    <RadioGroupItem value={type.value} className="mt-0.5" />
                                    <span>
                                        <span className="block text-sm font-semibold">{type.label}</span>
                                        <span className="block text-xs text-muted-foreground">{type.description}</span>
                                    </span>
                                </label>
                            );
                        })}
                    </RadioGroup>

                    {!isFree && (
                        <div className="max-w-xs">
                            <Input
                                id="course-price"
                                type="number"
                                step="0.01"
                                min={MIN_PAID_PRICE}
                                {...register("price", { valueAsNumber: true })}
                                label="Price (USD)"
                                errorText={formState.errors.price?.message}
                                helperText={`At least $${MIN_PAID_PRICE.toFixed(2)}`}
                                leftIcon={<DollarSign className="size-4" />}
                                fullWidth
                            />
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" size="lg" rounded="xl" isLoading={isPending} disabled={!formState.isDirty}>
                            {isPending ? (
                                "Saving..."
                            ) : (
                                <>
                                    <Save />
                                    Save price
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
