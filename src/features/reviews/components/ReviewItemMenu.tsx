"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteReview } from "../hooks/useDeleteReview";

type ReviewItemMenuProps = {
    courseId: string;
    reviewId: string;
    isReview: boolean; // a review (with stars) or a reply → the words in the menu
    onEdit: () => void;
};

// The "..." menu of YOUR comment: Edit / Delete (Delete asks first)
export function ReviewItemMenu({ courseId, reviewId, isReview, onEdit }: ReviewItemMenuProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { mutate: deleteReview, isPending } = useDeleteReview();

    const name = isReview ? "review" : "reply";

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            rounded="full"
                            className="text-muted-foreground"
                            aria-label={`More actions for your ${name}`}
                        />
                    }
                >
                    <MoreHorizontal />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={onEdit}>
                        <Pencil />
                        Edit {name}
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => setIsConfirmOpen(true)}>
                        <Trash2 />
                        Delete {name}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title={`Delete your ${name}?`}
                description="This can't be undone. Replies under it stay."
                confirmLabel={`Delete ${name}`}
                destructive
                isPending={isPending}
                onConfirm={() => deleteReview({ courseId, reviewId }, { onSuccess: () => setIsConfirmOpen(false) })}
            />
        </>
    );
}
