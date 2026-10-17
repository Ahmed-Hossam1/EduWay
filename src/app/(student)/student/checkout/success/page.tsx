import { notFound, redirect } from "next/navigation";
import { CheckoutSuccessPage } from "@/features/checkout/CheckoutSuccessPage";
import { fulfillOrder } from "@/features/checkout/server/fulfillOrder";
import { getOrderBySession } from "@/features/checkout/server/getOrderBySession";

export const metadata = {
    title: "Order confirmation",
    robots: { index: false }, // a private page => Google shouldn't show it
};

type Params = {
    searchParams: Promise<{ session_id?: string | string[] }>;
};

// Stripe sends the user here after paying: /student/checkout/success?session_id=cs_test_...
// Protected in proxy.ts (/student) => only logged-in users get here
export default async function CheckoutSuccess({ searchParams }: Params) {
    const { session_id: sessionId } = await searchParams;
    if (typeof sessionId !== "string") redirect("/cart");

    // 1- His order of this session (RLS → another user's session id gives null)
    const order = await getOrderBySession(sessionId);
    if (!order) notFound();

    // 2- Still pending? The webhook may be late → ask Stripe ourselves and enroll him now.
    //    (fulfillOrder is safe to call twice: the webhook and this page don't create duplicates)
    if (order.status === "pending") {
        try {
            const isPaid = await fulfillOrder(sessionId);
            if (isPaid) order.status = "paid";
        } catch (error) {
            // not a reason to break the page: it shows "Confirming your payment" and the webhook will finish it
            console.error("Fulfill order error:", error);
        }
    }

    return <CheckoutSuccessPage order={order} />;
}
