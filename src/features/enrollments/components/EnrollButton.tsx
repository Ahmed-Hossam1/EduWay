"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRequireLogin } from "@/features/profile/hooks/useRequireLogin";
import { useCart } from "@/features/cart/hooks/useCart";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useEnrollments } from "../hooks/useEnrollments";
import { useEnroll } from "../hooks/useEnroll";
import { getCourseLearnHref } from "@/features/learn/utils";

type EnrollButtonProps = {
    courseId: string;
    courseSlug: string; // "Go to course" → /learn/<slug>
    price: number;
    className?: string;
};

/**
 * The main button of a course:
 *   - already enrolled → "Go to course"
 *   - free course      → "Enroll for free"  (enrolls right away)
 *   - paid course      → "Enroll now"       (adds to the cart, then opens the cart to pay)
 */
export function EnrollButton({ courseId, courseSlug, price, className }: EnrollButtonProps) {
    const router = useRouter();
    const requireLogin = useRequireLogin();
    const { data: enrolledIds = [] } = useEnrollments();
    const { data: cartIds = [] } = useCart();
    const { mutate: enroll, isPending: isEnrolling } = useEnroll();
    const { mutate: addToCart, isPending: isAdding } = useAddToCart();

    const isFree = price === 0;
    const buttonClass = cn("h-11 w-full font-semibold", className);

    // enrolled → the lesson player opens the first lesson not done yet
    if (enrolledIds.includes(courseId)) {
        return (
            <Button size="lg" rounded="xl" className={buttonClass} asChild>
                <Link href={getCourseLearnHref(courseSlug)}>
                    Go to course
                    <ArrowRight />
                </Link>
            </Button>
        );
    }

    const handleClick = () => {
        if (!requireLogin("Log in to enroll in this course")) return;

        if (isFree) {
            enroll(courseId);
            return;
        }

        // paid: already in the cart → go pay
        if (cartIds.includes(courseId)) {
            router.push("/cart");
            return;
        }

        // not in the cart yet → open the cart only AFTER it is saved
        // (otherwise the cart page can load before the course is in it)
        addToCart(courseId, { onSuccess: () => router.push("/cart") });
    };

    return (
        <Button
            type="button"
            size="lg"
            rounded="xl"
            className={buttonClass}
            onClick={handleClick}
            disabled={isEnrolling || isAdding}
        >
            {isFree ? "Enroll for free" : "Enroll now"}
        </Button>
    );
}
