import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// Routes that require a logged-in user (any path that starts with one of these)
const protectedRoutes = ["/choose-role", "/onboarding", "/dashboard", "/waiting", "/rejected"];

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
        }
    );

    // 3- Who is the user? getUser() verifies the token with Supabase,
    //    unlike getSession() which only trusts the cookie.
    const { data: { user } } = await supabase.auth.getUser();

    // 4- Not logged in + trying to open a protected route => go to /login
    const pathname = request.nextUrl.pathname;
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    if (!user && isProtected) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }
    // 5- Otherwise let the request pass
    return response;
}

// Run the proxy on pages only — skip api routes, Next.js internals and static files
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
