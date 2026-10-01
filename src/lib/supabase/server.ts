"use server"

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/* Supabase Server Client

 Used in Server Components, API Routes and OAuth Callback.

 We use `createServerClient` from `@supabase/ssr`
 so Supabase can work with Next.js cookies on the server.

 Browser → createBrowserClient()
 Server  → createServerClient()

 The Browser starts OAuth and receives:
 /callback?code=...

 The Server uses that code with:
 exchangeCodeForSession(code)
- This allows the server to create/read the user's session.
*/

export async function createSupabaseServerClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },

                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                        // Can be ignored when called from a Server Component
                        // if a Proxy is handling session refresh.
                    }
                },
            },
        }
    );
}