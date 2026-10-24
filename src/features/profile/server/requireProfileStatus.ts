import "server-only";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { getAuthRedirectRoute } from "@/features/auth/shared/utils/getAuthRedirectRoute";
import { ProfileStatus, UserRole } from "../types";
import { getProfileById } from "./getProfileById";

/**
 * Server pages / layouts only: "only a user with THIS role and status stays on this page".
 *   not logged in        → /auth/login (getAuthUser)
 *   another role/status  → his own page (getAuthRedirectRoute: home, onboarding, waiting, dashboard...)
 *   the right one        → { user, profile } for the page to use
 *
 *   const { profile } = await requireProfileStatus("teacher", "waiting");
 *
 * Both calls are cached per request, so a layout and its page can use it without extra queries.
 */
export async function requireProfileStatus(role: UserRole, status: ProfileStatus) {
    const user = await getAuthUser();
    const profile = await getProfileById(user.id);

    if (profile.role !== role || profile.status !== status) {
        redirect(getAuthRedirectRoute(profile.role, profile.status));
    }

    return { user, profile };
}
