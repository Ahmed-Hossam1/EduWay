import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "./server";

/**
 * Server only: the logged-in user, or null for a guest (no redirect).
 * For pages that also work for guests (/cart) and for server functions that must not
 * call a "logged-in only" database function when nobody is logged in.
 * cache() → called many times in one request, Supabase is asked only ONCE.
 *
 *   const user = await getCurrentUser();
 *   if (!user) return [];
 *
 * (Need the user for sure? → getAuthUser(), it sends guests to /auth/login.)
 */
export const getCurrentUser = cache(async () => {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
});
