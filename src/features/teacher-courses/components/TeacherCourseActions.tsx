"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Link2, MoreHorizontal, Trash2 } from "lucide-react";
import { getCourseLearnHref } from "@/features/learn/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { CourseStatus } from "@/features/courses/types";
import { useUnpublishCourse } from "../hooks/useUnpublishCourse";
import { useDeleteDraftCourse } from "../hooks/useDeleteDraftCourse";
import { copyCourseLink } from "../utils/copyCourseLink";

type TeacherCourseActionsProps = {
    courseId: string;
    courseTitle: string;
    courseSlug: string;
    status: CourseStatus;
};

// Which "are you sure?" dialog is open (null = none)
type OpenDialog = "unpublish" | "delete" | null;

/**
 * The "..." menu of a course row.
 *   published → View as student, Copy course link, Unpublish
 *   draft     → View as student, Delete draft
 * Unpublish and Delete ask first (ConfirmDialog).
 */
export function TeacherCourseActions({ courseId, courseTitle, courseSlug, status }: TeacherCourseActionsProps) {
    const [openDialog, setOpenDialog] = useState<OpenDialog>(null);
    const { mutate: unpublish, isPending: isUnPublishing } = useUnpublishCourse();
    const { mutate: deleteDraft, isPending: isDeleting } = useDeleteDraftCourse();

    const isPublished = status === "published";
    const isDraft = status === "draft";

    const closeDialog = () => setOpenDialog(null);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    aria-label={`More actions for ${courseTitle}`}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring aria-expanded:bg-muted"
                >
                    <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                    {/* a real link to /learn/<slug> → inside the dashboard it is intercepted
                        and opens the lesson player in a modal (app/(teacher)/@modal/(...)learn) */}
                    <DropdownMenuItem render={<Link href={getCourseLearnHref(courseSlug)} />}>
                        <Eye />
                        View as student
                    </DropdownMenuItem>

                    {isPublished && (
                        <>
                            <DropdownMenuItem onClick={async () => await copyCourseLink(courseSlug)}>
                                <Link2 />
                                Copy course link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setOpenDialog("unpublish")}>
                                <EyeOff />
                                Unpublish
                            </DropdownMenuItem>
                        </>
                    )}

                    {/* only a draft can be deleted (a published course has students) */}
                    {isDraft && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => setOpenDialog("delete")}>
                                <Trash2 />
                                Delete draft
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                open={openDialog === "unpublish"}
                onOpenChange={(open) => !open && closeDialog()}
                title="Unpublish this course?"
                description="New students won't find it anymore. Students who already bought it keep their access."
                confirmLabel="Unpublish"
                isPending={isUnPublishing}
                onConfirm={() => unpublish(courseId, { onSuccess: closeDialog })}
            />

            <ConfirmDialog
                open={openDialog === "delete"}
                onOpenChange={(open) => !open && closeDialog()}
                title="Delete this draft?"
                description={`"${courseTitle}" will be deleted. This can't be undone.`}
                confirmLabel="Delete draft"
                destructive
                isPending={isDeleting}
                onConfirm={() => deleteDraft(courseId, { onSuccess: closeDialog })}
            />
        </>
    );
}
