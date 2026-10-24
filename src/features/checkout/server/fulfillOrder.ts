import "server-only";
import { stripe } from "@/lib/stripe/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Server only: after a Stripe payment => enroll the user in the courses of the order.
 *
 * Called from 2 places with the same Stripe session id:
 *   - the webhook  (/api/checkout/webhook)       => Stripe calls us
 *   - the success page (/student/checkout/success) => in case the webhook is late
 *
 * Safe to call many times: fulfill_order() skips a paid order and never adds the same enrollment twice.
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

    // 2- The database enrolls the buyer in every course of the order, then order → paid (all or nothing).
    //    Admin client: ONLY the server may call fulfill_order — a user can never mark his own order as paid.
    const supabase = createSupabaseAdminClient();

    const { data: paid, error } = await supabase.rpc("fulfill_order", { p_order_id: orderId });

    // throw => the webhook answers 500 => Stripe tries again later
    if (error) throw error;
    if (!paid) throw new Error(`Order ${orderId} of Stripe session ${sessionId} doesn't exist`);

    return true;
};
