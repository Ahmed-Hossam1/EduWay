import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe";
import { requireUser } from "@/lib/supabase/requireUser";
import { CreatedOrder } from "@/features/checkout/types";

// create_order() errors → what the user reads
const ORDER_ERRORS: Record<string, string> = {
    OWN_COURSE: "You can't buy your own course. Remove it from your cart.",
    EMPTY_CART: "Your cart has no courses to buy",
    MIXED_CURRENCIES: "All courses must have the same currency",
};

// POST /api/checkout (no body) → { url }  = the Stripe payment page
// We buy the WHOLE cart: the database reads the cart itself, so the browser
// can't send fake courses or fake prices.
export async function POST() {
    try {
        // 1- Is the user logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { supabase, user } = auth;

        // 2- The database creates the order (pending) + its courses in ONE step, with ITS prices.
        //    It keeps only what he can buy: published + paid + not his own course + not owned already.
        const { data, error } = await supabase.rpc("create_order");

        if (error) {
            const message = ORDER_ERRORS[error.message];
            if (message) return NextResponse.json({ message }, { status: 400 });
            throw error;
        }

        const { orderId, courses, currency } = data as CreatedOrder;

        // 3- Create the Stripe Checkout Session (one line per course)
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: user.email,
            line_items: courses.map((course) => ({
                quantity: 1,
                price_data: {
                    currency: currency.toLowerCase(), // Stripe wants "usd"
                    unit_amount: Math.round(course.price * 100), // 49.99 → 4999 cents
                    product_data: {
                        name: course.title,
                        // Stripe only shows public https images
                        images: course.thumbnail_url?.startsWith("https://") ? [course.thumbnail_url] : [],
                    },
                },
            })),
            // fulfillOrder() reads it to know which order was paid
            metadata: { orderId },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/student/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?checkout=cancelled`,
        });

        // 4- Save the session id on HIS order (the webhook "expired" event and the success page use it)
        const { error: sessionError } = await supabase.rpc("attach_order_session", {
            p_order_id: orderId,
            p_session_id: session.id,
        });

        if (sessionError) throw sessionError;

        // 5- The browser goes to the Stripe payment page
        return NextResponse.json({ url: session.url }, { status: 200 });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ message: "Failed to start the checkout" }, { status: 500 });
    }
}
