import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe";
import { requireUser } from "@/lib/supabase/requireUser";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPurchasableCart } from "@/features/checkout/server/getPurchasableCart";

// POST /api/checkout (no body) → { url }  = the Stripe payment page
// We buy the WHOLE cart: the server reads the cart itself, so the browser
// can't send fake courses or fake prices.
export async function POST() {
    try {
        // 1- Is the user logged in?
        const auth = await requireUser();
        if (!auth.ok) return auth.response;
        const { user } = auth;

        // 2- What he can really buy from his cart + the total + the currency (the database applies the rules:
        //    published + paid + not his own course + not owned already)
        const { courses, total, currency, mixedCurrencies, hasOwnCourse } = await getPurchasableCart();

        if (courses.length === 0 || !currency) {
            // his own course is in the cart (added before the cart API refused it) → tell him clearly
            const message = hasOwnCourse
                ? "You can't buy your own course. Remove it from your cart."
                : "Your cart has no courses to buy";

            return NextResponse.json({ message }, { status: 400 });
        }

        // 3- one Stripe payment = one currency
        if (mixedCurrencies) {
            return NextResponse.json({ message: "All courses must have the same currency" }, { status: 400 });
        }

        // 4- Save the order (pending) + its courses with the price of today
        //    (admin client: users can only READ orders, see the orders migration)
        const admin = createSupabaseAdminClient();

        const { data: order, error: orderError } = await admin
            .from("orders")
            .insert({ user_id: user.id, total, currency })
            .select("id")
            .single();

        if (orderError) throw orderError;

        const { error: itemsError } = await admin
            .from("order_items")
            .insert(courses.map((course) => ({ order_id: order.id, course_id: course.id, price: course.price })));

        if (itemsError) throw itemsError;

        // 5- Create the Stripe Checkout Session (one line per course)
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
            metadata: { orderId: order.id },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/student/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?checkout=cancelled`,
        });

        // the webhook "expired" event finds the order by this id
        const { error: sessionError } = await admin
            .from("orders")
            .update({ stripe_session_id: session.id })
            .eq("id", order.id);

        if (sessionError) throw sessionError;

        // 6- The browser goes to the Stripe payment page
        return NextResponse.json({ url: session.url }, { status: 200 });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ message: "Failed to start the checkout" }, { status: 500 });
    }
}
