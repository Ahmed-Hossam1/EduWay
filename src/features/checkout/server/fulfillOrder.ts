import "server-only";
import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Server only: after a Stripe payment → enroll the user in the courses of the order.
 *
 * Called from 2 places with the same Stripe session id:
 *   - the webhook  (/api/checkout/webhook)       → Stripe calls us
 *   - the success page (/student/checkout/success) → in case the webhook is late
 *
 * Safe to call many times: the enrollments use upsert (no duplicates),
 * and a paid order is skipped at the start.
 *
 * Returns true when the order is paid.
 */
export const fulfillOrder = async (sessionId: string): Promise<boolean> => {
    // 1- Ask Stripe (never trust the URL): is this session really paid?
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return false;

    // the order id was saved in the session when we created it (/api/checkout)
    const orderId = session.metadata?.orderId;
    if (!orderId) throw new Error(`Stripe session ${sessionId} has no orderId`);

    const supabase = createSupabaseAdminClient();

    // 2- Get the order (+ its courses)
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("id, user_id, status, order_items ( course_id )")
        .eq("id", orderId)
        .single();

    if (orderError) throw orderError;

    // already done before (by the webhook or the success page) → nothing to do
    if (order.status === "paid") return true;

    // 3- Enroll the user in every course of the order
    //    (the enrollments triggers remove them from the cart + wishlist and add students_count)
    const enrollments = order.order_items.map((item) => ({
        user_id: order.user_id,
        course_id: item.course_id,
    }));

    const { error: enrollError } = await supabase
        .from("enrollments")
        .upsert(enrollments, { onConflict: "user_id,course_id", ignoreDuplicates: true });

    // throw => the webhook answers 500 => Stripe tries again later
    if (enrollError) throw enrollError;

    // 4- Mark the order as paid (only AFTER the enrollments are saved)
    const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", order.id);

    if (updateError) throw updateError;

    return true;
};
