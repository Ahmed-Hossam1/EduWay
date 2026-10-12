import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Order } from "../types";

/**
 * Server only: the logged-in user's order of this Stripe session (+ its courses).
 * Uses the normal client => RLS returns only HIS orders,
 * so another user's session id gives null => 404.
 */
export const getOrderBySession = async (sessionId: string): Promise<Order | null> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("orders")
        .select(`
            id, status, total, currency, created_at,
            order_items ( price, course:courses ( id, title, slug, thumbnail_url ) )
        `)
        .eq("stripe_session_id", sessionId)
        .maybeSingle();

    if (error) throw error;

    return data as unknown as Order | null;
};
