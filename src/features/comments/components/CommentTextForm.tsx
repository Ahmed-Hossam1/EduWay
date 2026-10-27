"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { commentTextInputs } from "../data/commentInputs";
import { commentTextSchema, CommentTextValues } from "../schemas/commentSchemas";

type CommentTextFormProps = {
    defaultBody?: string; // editing → the current text
    placeholder?: string; // "Write a reply...", "Ask a question..."
    submitLabel: string; // "Reply", "Save", "Ask"
    isPending: boolean;
    onSubmit: (body: string, clear: () => void) => void;
    onCancel?: () => void; // no Cancel → the form stays (e.g. "Ask a question")
    rows?: number;
    autoFocus?: boolean;
};

// The small text form: write a reply, edit a comment, ask a question. Esc = cancel.
export function CommentTextForm({
    defaultBody = "",
    placeholder,
    submitLabel,
    isPending,
    onSubmit,
    onCancel,
    rows = 2,
    autoFocus = true,
}: CommentTextFormProps) {
    const { register, handleSubmit, formState, reset } = useForm<CommentTextValues>({
        resolver: zodResolver(commentTextSchema),
        defaultValues: { body: defaultBody },
    });

    // clear() → the parent empties the form after a successful post (a form that stays on the page)
    const submit = (values: CommentTextValues) => {
        onSubmit(values.body, () => reset({ body: "" }));
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-2">
            {commentTextInputs.map((input) => (
                <Textarea
                    key={input.id}
                    {...register(input.name)}
                    aria-label={placeholder ?? input.placeholder}
                    placeholder={placeholder ?? input.placeholder}
                    errorText={formState.errors[input.name]?.message}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") onCancel?.();
                    }}
                    rows={rows}
                    autoFocus={autoFocus}
                />
            ))}

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" size="sm" isLoading={isPending}>
                    {isPending ? "Saving..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}
