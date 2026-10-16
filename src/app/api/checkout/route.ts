import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// One cart row with its course (what we read from Supabase)
type CartRow = {
    course: {
        id: string;
        title: string;
        price: number;
        currency: string;
        status: string;
        instructor_id: string;
        thumbnail_url: string | null;
    } | null;
};

// POST /api/checkout (no body) → { url }  = the Stripe payment page
// We buy the WHOLE cart: the server reads the cart itself, so the browser
// can't send fake courses or fake prices.
export async function POST() {
    try {
        // 1- Is the user logged in?
        const supabase = await createSupabaseServerClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        // 2- His cart (RLS → only his rows) + the courses he already owns
        const { data: cartRows, error: cartError } = await supabase
            .from("cart_items")
            .select("course:courses ( id, title, price, currency, status, instructor_id, thumbnail_url )")
            .eq("user_id", user.id);

        if (cartError) throw cartError;

        const { data: enrollments, error: enrollmentsError } = await supabase
            .from("enrollments")
            .select("course_id")
            .eq("user_id", user.id)
            .neq("status", "refunded");

        if (enrollmentsError) throw enrollmentsError;

        const ownedIds = enrollments.map((item) => item.course_id);

        // 3- Keep only the courses he can really buy:
        //    published + paid + not his own course + not owned already
        const courses = (cartRows as unknown as CartRow[])
            .map((row) => row.course)
            .filter((course) => course !== null)
            .filter((course) => course.status === "published")
            .filter((course) => course.price > 0)
            .filter((course) => course.instructor_id !== user.id)
            .filter((course) => !ownedIds.includes(course.id));

        if (courses.length === 0) {
            return NextResponse.json({ message: "Your cart has no courses to buy" }, { status: 400 });
        }

        // one Stripe payment = one currency
        const currency = courses[0].currency;
        if (courses.some((course) => course.currency !== currency)) {
            return NextResponse.json({ message: "All courses must have the same currency" }, { status: 400 });
        }

        const total = courses.reduce((sum, course) => sum + course.price, 0);

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
