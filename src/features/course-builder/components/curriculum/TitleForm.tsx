"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { titleSchema, TitleValues } from "../../schemas/curriculumSchemas";

type TitleFormProps = {
    defaultTitle?: string; // renaming → the current title
    placeholder: string;
    submitLabel: string; // "Add section", "Add lesson", "Save"
    isPending: boolean;
    onSubmit: (title: string) => void;
    onCancel: () => void;
};

// A small one-line form: add a section / add a lesson / rename a section. Esc = cancel.
export function TitleForm({
    defaultTitle = "",
    placeholder,
    submitLabel,
    isPending,
    onSubmit,
    onCancel,
}: TitleFormProps) {
    const { register, handleSubmit, formState } = useForm<TitleValues>({
        resolver: zodResolver(titleSchema),
        defaultValues: { title: defaultTitle },
    });

    return (
        <form onSubmit={handleSubmit((values) => onSubmit(values.title))} className="flex flex-wrap items-start gap-2">
            <div className="min-w-48 flex-1">
                <Input
                    {...register("title")}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    errorText={formState.errors.title?.message}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") onCancel();
                    }}
                    autoFocus
                    fullWidth
                />
            </div>
            <Button type="submit" isLoading={isPending}>
                {isPending ? "Saving..." : submitLabel}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
            </Button>
        </form>
    );
}
