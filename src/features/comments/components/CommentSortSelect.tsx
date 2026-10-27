"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { commentSortOptions } from "../data/commentInputs";
import { CommentSort } from "../types";

type CommentSortSelectProps = {
    value: CommentSort;
    onChange: (sort: CommentSort) => void;
    label: string; // "Sort reviews", "Sort questions" (for screen readers)
};

// "Sort by Newest / Oldest" above a comment list
export function CommentSortSelect({ value, onChange, label }: CommentSortSelectProps) {
    return (
        <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-muted-foreground">Sort by</span>
            <Select
                value={value}
                onValueChange={(sort) => onChange(sort as CommentSort)}
                itemToStringLabel={(id) => commentSortOptions.find((option) => option.id === id)?.label ?? ""}
            >
                <SelectTrigger className="w-32" aria-label={label}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {commentSortOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
