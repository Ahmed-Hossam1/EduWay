"use client"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { startOAuthService } from "../services/oauth"
import { AUTH_MUTATION_KEY } from "../../shared/hooks/useIsAuthBusy"

/**
 * "Sign in with Google / GitHub":
 *   success → go to the Google / GitHub page (then back to /api/auth/callback)
 *   error   → the OAuth failure page
 *
 *   const { mutate: signInWith } = useOAuthLogin()
 *   signInWith("google")
 */
export const useOAuthLogin = () => {
    const router = useRouter()

    return useMutation({
        mutationKey: AUTH_MUTATION_KEY, // → useIsAuthBusy() is true while it runs
        mutationFn: startOAuthService,

        onSuccess: (url) => {
            // Google / GitHub is another website → a full page change (not router.push)
            window.location.href = url

            // The page needs a moment to leave. Returning a promise that never finishes keeps
            // this mutation "pending" until the browser leaves → the buttons stay disabled
            // (otherwise they would turn on again for a second before Google opens).
            return new Promise(() => { })
        },

        onError: (error) => {
            console.error("OAuth start error:", error)
            router.push("/auth/oauth-error?error=oauth_start")
        },
    })
}
