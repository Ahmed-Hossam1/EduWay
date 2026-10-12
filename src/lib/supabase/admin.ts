import "server-only";
import { createClient } from "@supabase/supabase-js";

/* Supabase Admin Client (secret key)

 RLS does NOT apply to it => it can write anything.
 Use it ONLY on the server, and only after checking the user yourself.

 Used by the checkout:
 - create orders / order_items (users can only read them)
 - create enrollments for PAID courses after Stripe says "paid"
   (from the browser RLS allows free courses only)

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
