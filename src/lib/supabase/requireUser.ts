import "server-only";
import { NextResponse } from "next/server";
import { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./server";

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

type RequireUserResult =
    | { ok: true; supabase: SupabaseServerClient; user: User }
    | { ok: false; response: NextResponse };

/**
 * For API routes: is the user logged in?
 *   yes → { ok: true, supabase, user }   (use THIS supabase client for the queries: it has his session)
 *   no  → { ok: false, response }        (a ready 401 { message } to return)
 *
 *   const auth = await requireUser();
 *   if (!auth.ok) return auth.response;
 *   const { supabase, user } = auth;
 *
 * (Server pages use getAuthUser() instead: it redirects to /auth/login.)
 */
export async function requireUser(): Promise<RequireUserResult> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { ok: false, response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
    }

    return { ok: true, supabase, user };
}
