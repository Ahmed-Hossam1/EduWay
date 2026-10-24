import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./getCurrentUser";

/**
 * Server only: the logged-in user (or → /auth/login).
 * cache() → the layout AND the page can both call it: Supabase is asked only ONCE per request.
 *
 *   const user = await getAuthUser();
 *   user.id
 */
export const getAuthUser = cache(async () => {
    const user = await getCurrentUser();

    if (!user) redirect("/auth/login");

    return user;
});
