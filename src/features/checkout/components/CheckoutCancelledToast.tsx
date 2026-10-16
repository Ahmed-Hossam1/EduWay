"use client";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/**
 * Shows "Payment cancelled" when the user comes back from Stripe with ?checkout=cancelled,
 * then removes the param from the URL (so a refresh doesn't show it again).
 * Renders nothing.
 */
export function CheckoutCancelledToast() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isCancelled = searchParams.get("checkout") === "cancelled";

    useEffect(() => {
        if (!isCancelled) return;

        toast.info("Payment cancelled — your cart is still here");
        router.replace(pathname, { scroll: false });
    }, [isCancelled, pathname, router]);

    return null;
}
