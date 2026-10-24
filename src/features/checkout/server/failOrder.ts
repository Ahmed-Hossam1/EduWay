import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Server only: the Stripe session expired (the user never paid) → order = failed.
 * Called from the webhook. A paid order is never changed (status must be pending).
 */
export const failOrder = async (sessionId: string): Promise<void> => {
    // admin client: only the server may call fail_order (Stripe calls us, there is no logged-in user)
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.rpc("fail_order", { p_session_id: sessionId });

    if (error) throw error;
};
