import { getAuthRedirectRoute } from "@/features/auth/shared/utils/getAuthRedirectRoute";
import { canAccessRoute, isProtectedRoute, requiresLogin } from "@/lib/authorization/paths";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// Which pages need a login, and which roles can open which pages: ONE place → lib/authorization/paths.ts

export async function proxy(request: NextRequest) {
    // 1- The response we will return if the user is allowed to continue.
    //    Supabase may refresh the session and write new cookies on it.
    let response = NextResponse.next({ request });

    // 2- Supabase client for the proxy: reads cookies from the request
    //    and writes refreshed cookies to both the request and the response.
    //    (We don't use createSupabaseServerClient() here because it creates a new
    //    supabase client for each request, and we need to use the same client for
    //    the proxy and the request.)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    // get all cookies from the request
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // if the access token is expired we have refresh one so supabase needs to write new cookies to the request
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    // if we updated the cookies for the request so we need to create a new response with the updated cookies
                    response = NextResponse.next({ request });
                    // and for the response we need to set the cookies with the new values and options
                    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
                },
            },
        },
    );

    // 3- Who is the user? getUser() verifies the token with Supabase,
    //    unlike getSession() which only trusts the cookie.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 4- Not logged in + trying to open a protected route => go to /login
    const pathname = request.nextUrl.pathname;
    const protectedPage = isProtectedRoute(pathname);

    // not logged in
    if (!user && requiresLogin(pathname)) {
        const loginUrl = new URL("/auth/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 5- Logged in + a page for some roles only => does his role (and status) allow it?
    //    (one small query, only on the role pages)
    if (user && protectedPage) {
        const { data: profile } = await supabase.from("profiles").select("role, status").eq("id", user.id).single();

        const role = profile?.role ?? null;
        const status = profile?.status ?? null;

        if (!canAccessRoute(role, status, pathname)) {
            // send him to his own home: student => "/", waiting teacher => /account/waiting, ...
            const homeUrl = new URL(getAuthRedirectRoute(role ?? "", status ?? ""), request.url);
            return NextResponse.redirect(homeUrl);
        }
    }

    // 6- Otherwise let the request pass
    return response;
}

// Run the proxy on pages only — skip api routes, Next.js internals and static files
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
