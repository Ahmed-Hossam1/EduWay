"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type StudentViewModalProps = {
    children: ReactNode; // the lesson player (or a message)
};

/**
 * "View as student": the lesson player in a big modal, on top of the teacher dashboard.
 * It is always open while its page is shown (an intercepted route);
 * closing it goes back to "My courses" → the @modal slot becomes empty again.
 */
export function StudentViewModal({ children }: StudentViewModalProps) {
    const router = useRouter();

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) router.push("/teacher/courses");
            }}
        >
            <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto p-0 sm:max-w-6xl">
                <DialogHeader className="border-b border-border px-6 py-4">
                    <DialogTitle>Student view</DialogTitle>
                    <DialogDescription>This is what your students see when they open your course.</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
