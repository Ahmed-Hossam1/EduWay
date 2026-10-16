import { Suspense } from "react";
import { Course } from "@/features/courses/types";
import { CartList } from "./components/CartList";
import { CartListSkeleton } from "./components/CartListSkeleton";
import { CheckoutCancelledToast } from "@/features/checkout/components/CheckoutCancelledToast";

type CartPageProps = {
    coursesPromise: Promise<Course[]>;
};

export function CartPage({ coursesPromise }: CartPageProps) {
    return (
        <section className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            {/* back from Stripe without paying → toast (useSearchParams needs a Suspense) */}
            <Suspense fallback={null}>
                <CheckoutCancelledToast />
            </Suspense>

            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">Shopping cart</h1>

            <div className="mt-8">
                <Suspense fallback={<CartListSkeleton />}>
                    <CartList coursesPromise={coursesPromise} />
                </Suspense>
            </div>
        </section>
    );
}
