import { EnrollButton } from "@/features/enrollments/components/EnrollButton";
import { formatPrice } from "@/features/courses/utils/format";

type CourseMobileBarProps = {
    courseId: string;
    price: number;
    currency: string;
};

// Small screens: price + Enroll always visible at the bottom
export function CourseMobileBar({ courseId, price, currency }: CourseMobileBarProps) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md lg:hidden">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                <p className="text-xl font-black text-foreground">{formatPrice(price, currency)}</p>
                <EnrollButton courseId={courseId} price={price} className="w-auto flex-1 sm:flex-none sm:px-10" />
            </div>
        </div>
    );
}
