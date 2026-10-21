"use client";
import { CheckCircle2 } from "lucide-react";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import { useEnrollments } from "../hooks/useEnrollments";
import { EnrollButton } from "./EnrollButton";
import { CourseOwnerNotice } from "./CourseOwnerNotice";
import { useIsCourseOwner } from "../hooks/useIsCourseOwner";

type CoursePurchaseActionsProps = {
    courseId: string;
    price: number;
    instructorId: string; // to know if the user is the teacher of this course
};

// The buttons of the course price card. Enrolled → only "Go to course" (no cart / wishlist).
export function CoursePurchaseActions({ courseId, price, instructorId }: CoursePurchaseActionsProps) {
    const { data: enrolledIds = [] } = useEnrollments();
    const isEnrolled = enrolledIds.includes(courseId);
    const isOwner = useIsCourseOwner(instructorId);

    // his own course → no buy / cart / wishlist
    if (isOwner) return <CourseOwnerNotice />;

    if (isEnrolled) {
        return (
            <div className="space-y-2.5">
                <p className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" />
                    You&apos;re enrolled in this course
                </p>
                <EnrollButton courseId={courseId} price={price} />
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            <EnrollButton courseId={courseId} price={price} />
            {price > 0 && <AddToCartButton courseId={courseId} />}
            <WishlistButton courseId={courseId} variant="full" />
        </div>
    );
}
