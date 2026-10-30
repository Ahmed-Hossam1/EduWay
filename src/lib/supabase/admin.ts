import "server-only";
import { createClient } from "@supabase/supabase-js";

/* Supabase Admin Client (secret key)

 RLS does NOT apply to it => it can write anything.
 Use it ONLY on the server, and only after checking the user yourself.

 Used ONLY by the webhooks (/api/webhook/...): the service calls us, there is no logged-in user,
 and these database functions can be called by the server only:
   - Stripe     → fulfill_order / fail_order   (a user can never mark his order as paid)
   - Cloudinary → finish_video_hls             (a teacher can never mark his video as ready)
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
