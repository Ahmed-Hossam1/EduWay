// Google / GitHub sign-in failed → the user goes to /auth/oauth-error?error=<code>
// code → the message we show on that page.
//
// Who sends which code:
//   oauth_start      → POST /api/auth/oauth failed (we couldn't open the Google / GitHub page)
//   oauth_cancelled  → the user pressed "Cancel" on the Google / GitHub page
//   oauth_callback   → /api/auth/callback got no code
//   oauth_exchange   → /api/auth/callback couldn't turn the code into a session
//   user_not_found   → /api/auth/callback: signed in, but no user came back
//   profile_error    → /api/auth/callback: couldn't read the profile
//   bad_oauth_state  → Supabase error in the URL: the Google / GitHub page was opened again
//                      from the browser history (Back button) and its one-time code was already used
export const OAUTH_ERROR_MESSAGES: Record<string, string> = {
    oauth_start: "We couldn't open the Google or GitHub sign-in page. Please try again.",
    oauth_cancelled: "Sign-in was cancelled. You can try again or use your email and password.",
    oauth_callback: "We couldn't sign you in with Google or GitHub. Please try again.",
    oauth_exchange: "Your sign-in link expired or was already used. Please try again.",
    user_not_found: "We couldn't find your account after signing in. Please try again.",
    profile_error: "We couldn't load your profile. Please try again in a moment.",
    bad_oauth_state: "This sign-in page expired. Please sign in again from the login page.",
};

// any other code (old link, typo...) → a general message
export const DEFAULT_OAUTH_ERROR_MESSAGE = "Something went wrong while signing in. Please try again.";
