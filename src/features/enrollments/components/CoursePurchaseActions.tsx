"use client";
import { CheckCircle2 } from "lucide-react";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import { useEnrollments } from "../hooks/useEnrollments";
import { EnrollButton } from "./EnrollButton";

type CoursePurchaseActionsProps = {
    courseId: string;
    price: number;
};

// The buttons of the course price card. Enrolled → only "Go to course" (no cart / wishlist).
export function CoursePurchaseActions({ courseId, price }: CoursePurchaseActionsProps) {
    const { data: enrolledIds = [] } = useEnrollments();
    const isEnrolled = enrolledIds.includes(courseId);

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
