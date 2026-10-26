"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { replyInputs } from "../data/reviewInputs";
import { replySchema, ReplyValues } from "../schemas/reviewSchemas";

type ReplyFormProps = {
    defaultBody?: string; // editing → the current text
    submitLabel: string; // "Reply", "Save"
    isPending: boolean;
    onSubmit: (values: ReplyValues) => void;
    onCancel: () => void;
};

// The small text form under a comment: write a reply, or edit your reply. Esc = cancel.
export function ReplyForm({ defaultBody = "", submitLabel, isPending, onSubmit, onCancel }: ReplyFormProps) {
    const { register, handleSubmit, formState } = useForm<ReplyValues>({
        resolver: zodResolver(replySchema),
        defaultValues: { body: defaultBody },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {replyInputs.map((input) => (
                <Textarea
                    key={input.id}
                    {...register(input.name)}
                    aria-label={input.placeholder}
                    placeholder={input.placeholder}
                    errorText={formState.errors[input.name]?.message}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") onCancel();
                    }}
                    rows={2}
                    autoFocus
                />
            ))}

            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isPending}>
                    {isPending ? "Saving..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}
