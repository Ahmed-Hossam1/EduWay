"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
    isPending?: boolean;
    destructive?: boolean; // red confirm button (delete...)
};

/**
 * "Are you sure?" before an action that is hard to undo.
 * It's controlled: the parent decides when it opens (e.g. from a menu item).
 *
 *   <ConfirmDialog
 *       open={open} onOpenChange={setOpen}
 *       title="Delete this draft?" description="This can't be undone."
 *       confirmLabel="Delete" destructive
 *       onConfirm={() => deleteDraft(id)} isPending={isPending}
 *   />
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    onConfirm,
    isPending = false,
    destructive = false,
}: ConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    {/* isLoading → the Button draws the spinner and disables itself */}
                    <AlertDialogAction
                        variant={destructive ? "destructive" : "default"}
                        onClick={onConfirm}
                        isLoading={isPending}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
