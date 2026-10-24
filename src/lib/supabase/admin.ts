import "server-only";
import { createClient } from "@supabase/supabase-js";

/* Supabase Admin Client (secret key)

 RLS does NOT apply to it => it can write anything.
 Use it ONLY on the server, and only after checking the user yourself.

 Used ONLY to confirm a Stripe payment (fulfillOrder / failOrder):
 Stripe calls our webhook, there is no logged-in user, and the database functions
 fulfill_order / fail_order can be called by the server only (a user can never mark his order as paid).
 Everything else in the app uses the normal client: the database rules (RLS) protect the data.

 "server-only" => the build fails if a client component imports this file,
 so the secret key can never reach the browser.
*/

export function createSupabaseAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!,
        {
            // no user session here: it's the server itself, not a logged-in user
            auth: { persistSession: false, autoRefreshToken: false },
        }
    );
}
