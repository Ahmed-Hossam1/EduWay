import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Server only: the Stripe session expired (the user never paid) → order = failed.
 * Called from the webhook. A paid order is never changed (status must be pending).
 */
export const failOrder = async (sessionId: string): Promise<void> => {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("stripe_session_id", sessionId)
        .eq("status", "pending");

    if (error) throw error;
};
