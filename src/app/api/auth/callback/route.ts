import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthRedirectRoute } from "@/features/auth/shared/utils/getAuthRedirectRoute";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    try {
        // OAuth callback must contain a temporary authorization code.
        if (!code) {
            return NextResponse.redirect(
                new URL("/login?error=oauth_callback", request.url)
            );
        }

        const supabase = await createSupabaseServerClient();

        // Exchange the OAuth code for a Supabase session.
        const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
            console.error("OAuth exchange error:", exchangeError);

            return NextResponse.redirect(
                new URL("/login?error=oauth_exchange", request.url)
            );
        }

        // Get the authenticated user from the newly created session.
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Get user error:", userError);

            return NextResponse.redirect(
                new URL("/login?error=user_not_found", request.url)
            );
        }

        // Check if this OAuth user already has a profile.
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, status")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
            console.error("Profile lookup error:", profileError);

            return NextResponse.redirect(
                new URL("/login?error=profile_error", request.url)
            );
        }

        // New OAuth user:
        // No profile means the user still needs to choose a role.
        //
        // The profile will be created later by:
        // POST /api/auth/select-role
        if (!profile) {
            return NextResponse.redirect(
                new URL("/choose-role", request.url)
            );
        }

        // get the next route based on the role and status of the user
        const nextRoute = getAuthRedirectRoute(profile.role, profile.status)

        return NextResponse.redirect(
            new URL(nextRoute, request.url)
        );

    } catch (error) {
        console.error("OAuth callback error:", error);

        return NextResponse.redirect(
            new URL("/login?error=oauth_callback", request.url)
        );
    }
}