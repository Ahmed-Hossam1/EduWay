"use client"
import { useEffect } from "react"
import { toast } from "sonner"

// Supabase error_code → a clear message for the user
const OAUTH_ERROR_TOASTS: Record<string, string> = {
    // the Google / GitHub page was opened again from the browser history (Back button):
    // its one-time sign-in code was already used
    bad_oauth_state: "This sign-in page expired. Please sign in again from the login page.",
    // the user pressed "Cancel" on the Google / GitHub page
    access_denied: "Sign-in was cancelled.",
}

const DEFAULT_TOAST = "We couldn't sign you in with Google or GitHub. Please try again."

/**
 * When Google / GitHub sign-in fails, Supabase can't always send the user back to our
 * /api/auth/callback. Then it sends him to the home page with the error IN THE URL:
 *   /?error=invalid_request&error_code=bad_oauth_state&error_description=...
 * (sometimes after # instead of ?)
 *
 * This component runs on every page: it shows the error as a toast once,
 * then removes it from the URL (so a refresh doesn't show it again). Renders nothing.
 */
export function OAuthErrorToast() {
    useEffect(() => {
        // the error can be in the query (?...) or in the hash (#...) → read both
        const query = new URLSearchParams(window.location.search)
        const hash = new URLSearchParams(window.location.hash.slice(1)) // "#a=1" → "a=1"

        // only Supabase errors have error_description
        // (our own /auth/login?error=oauth_exchange is shown by the login page Alert)
        const description = query.get("error_description") ?? hash.get("error_description")
        if (!description) return

        const errorCode = query.get("error_code") ?? hash.get("error_code") ?? query.get("error") ?? hash.get("error") ?? ""
        console.error("OAuth sign-in error:", errorCode, description)
        toast.error(OAUTH_ERROR_TOASTS[errorCode] ?? DEFAULT_TOAST)

        // clean the URL: remove only the error params, keep the rest
        const errorParams = ["error", "error_code", "error_description"]
        errorParams.forEach((param) => query.delete(param))
        const cleanQuery = query.toString()
        window.history.replaceState(null, "", window.location.pathname + (cleanQuery ? `?${cleanQuery}` : ""))
    }, [])

    return null
}
