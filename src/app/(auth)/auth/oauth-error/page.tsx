import { OAuthErrorPage } from "@/features/auth/oauth/components/OAuthErrorPage";
import { DEFAULT_OAUTH_ERROR_MESSAGE, OAUTH_ERROR_MESSAGES } from "@/features/auth/oauth/data/oauthErrors";

export const metadata = {
    title: "Sign-in failed",
    robots: { index: false },
};

type Params = {
    searchParams: Promise<{ error?: string | string[] }>;
};

// /auth/oauth-error?error=<code> — the code comes from:
// useOAuthLogin (oauth_start), /api/auth/callback, or OAuthErrorRedirect (Supabase error in the URL)
export default async function OAuthError({ searchParams }: Params) {
    const { error } = await searchParams;

    const message =
        typeof error === "string"
            ? (OAUTH_ERROR_MESSAGES[error] ?? DEFAULT_OAUTH_ERROR_MESSAGE)
            : DEFAULT_OAUTH_ERROR_MESSAGE;

    return <OAuthErrorPage message={message} />;
}
