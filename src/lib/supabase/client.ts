
import { createBrowserClient } from "@supabase/ssr";

/*  Supabase Browser Client

 Used in Client Components / Browser.

 We use `createBrowserClient` from `@supabase/ssr`
 because the app uses Next.js SSR + OAuth PKCE.

 Browser → createBrowserClient()
 Server  → createServerClient()

 This client is mainly used for:
 - Login / Signup
 - Google OAuth
 - Client-side Supabase operations
*/

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabase_publishable_key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
if (!supabase_url || !supabase_publishable_key) throw new Error("missing important keys `supabase_url || supabase_key` ")

export const supabaseClient = createBrowserClient(supabase_url, supabase_publishable_key, {
    auth: {
        flowType: "pkce"
    }
})

// OAuth is configured to use the PKCE flow instead of the Implicit Flow.
//
// In the Implicit Flow, the OAuth provider redirects back with the
// access token directly in the URL as a hash:
//   /callback#access_token=...
//
// This means the access token is exposed to the browser through the URL.
//
// With PKCE, the provider redirects back with a temporary authorization code:
//   /callback?code=...
//
// The code itself is not the access token. The server receives this code
// and exchanges it for a session using exchangeCodeForSession(code).
// This keeps the OAuth token exchange on the server and is the recommended
// flow for server-side applications.
