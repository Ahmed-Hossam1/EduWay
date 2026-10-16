"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * When Google / GitHub sign-in fails, Supabase can't always send the user back to our
 * /api/auth/callback. Then it sends him to the home page with the error IN THE URL:
 *   /?error=invalid_request&error_code=bad_oauth_state&error_description=...
 * (sometimes after # instead of ?)
 * e.g. signed in → Back button → picked another Google account on the old Google page.
 *
 * This component runs on every page (root layout): if it finds such an error,
 * it sends the user to the OAuth failure page. Renders nothing.
 */
export function OAuthErrorRedirect() {
    const router = useRouter()

    useEffect(() => {
        // the error can be in the query (?...) or in the hash (#...) → read both
        const query = new URLSearchParams(window.location.search)
        const hash = new URLSearchParams(window.location.hash.slice(1)) // "#a=1" → "a=1"

        // only Supabase errors have error_description
        // (our own /auth/oauth-error?error=... doesn't, so no loop)
        const description = query.get("error_description") ?? hash.get("error_description")
        if (!description) return

        const supabaseCode = query.get("error_code") ?? hash.get("error_code") ?? query.get("error") ?? hash.get("error") ?? ""
        console.error("OAuth sign-in error:", supabaseCode, description)

        // Supabase code → our code (see OAUTH_ERROR_MESSAGES)
        const errorCode = supabaseCode === "access_denied" ? "oauth_cancelled" : supabaseCode

        // replace (not push) → the Back button doesn't come back to the broken URL
        router.replace(`/auth/oauth-error?error=${encodeURIComponent(errorCode)}`)
    }, [router])

    return null
}
