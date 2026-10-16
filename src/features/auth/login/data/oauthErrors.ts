// /api/auth/callback sends the user back to /auth/login?error=<code> when Google / GitHub sign-in fails.
// code → the message we show above the login form.
export const OAUTH_ERROR_MESSAGES: Record<string, string> = {
    oauth_callback: "We couldn't sign you in with Google or GitHub. Please try again.",
    oauth_cancelled: "Sign-in was cancelled. You can try again or use your email and password.",
    oauth_exchange: "Your sign-in link expired or was already used. Please try again.",
    user_not_found: "We couldn't find your account after signing in. Please try again.",
    profile_error: "We couldn't load your profile. Please try again in a moment.",
};

// any other code in the URL (old link, typo...) → a general message
export const DEFAULT_OAUTH_ERROR_MESSAGE = "Something went wrong while signing in. Please try again.";
