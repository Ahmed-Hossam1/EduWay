"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useCart } from "@/features/cart/hooks/useCart";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useEnrollments } from "../hooks/useEnrollments";
import { useEnroll } from "../hooks/useEnroll";

type EnrollButtonProps = {
    courseId: string;
    price: number;
    className?: string;
};

/**
 * The main button of a course:
 *   - already enrolled → "Go to course"
 *   - free course      → "Enroll for free"  (enrolls right away)
 *   - paid course      → "Enroll now"       (adds to the cart and opens it — paying = next phase)
 */
export function EnrollButton({ courseId, price, className }: EnrollButtonProps) {
    const router = useRouter();
    const { data: profile } = useProfile();
    const { data: enrolledIds = [] } = useEnrollments();
    const { data: cartIds = [] } = useCart();
    const { mutate: enroll, isPending: isEnrolling } = useEnroll();
    const { mutate: addToCart, isPending: isAdding } = useAddToCart();

    const isFree = price === 0;
    const buttonClass = cn("h-11 w-full font-semibold", className);

    // TODO (lesson player phase): link to the lesson page instead of My courses
    if (enrolledIds.includes(courseId)) {
        return (
            <Button size="lg" rounded="xl" className={buttonClass} asChild>
                <Link href="/student/my-courses">
                    Go to course
                    <ArrowRight />
                </Link>
            </Button>
        );
    }

    const handleClick = () => {
        if (!profile) {
            toast.info("Log in to enroll in this course");
            router.push("/auth/login");
            return;
        }

        if (isFree) {
            enroll(courseId);
            return;
        }

        // paid: put it in the cart (if it's not there yet) and go pay
        if (!cartIds.includes(courseId)) addToCart(courseId);
        router.push("/cart");
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
