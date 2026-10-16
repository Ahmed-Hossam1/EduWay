import LoginHero from "@/features/auth/login/components/LoginHero";
import LoginForm from "@/features/auth/login/components/LoginForm";
import { AuthHeader } from "@/features/auth/shared/components";
import { DEFAULT_OAUTH_ERROR_MESSAGE, OAUTH_ERROR_MESSAGES } from "@/features/auth/login/data/oauthErrors";

export const metadata = {
    title: "Sign In",
    description: "Sign in to your EduWay account and continue your learning journey.",
};

type Params = {
    searchParams: Promise<{ error?: string | string[] }>
}

export default async function LoginPage({ searchParams }: Params) {
    // Google / GitHub sign-in failed → /api/auth/callback sent us here with ?error=<code>
    const { error } = await searchParams;

    let errorMessage: string | undefined;
    if (typeof error === "string") {
        errorMessage = OAUTH_ERROR_MESSAGES[error] ?? DEFAULT_OAUTH_ERROR_MESSAGE;
    }

    return (
        <main className="min-h-screen w-full bg-background text-foreground">
            <div className="flex min-h-screen flex-col lg:flex-row">
                {/* ── Left: Hero / Branding ── */}
                <LoginHero />

                {/* ── Right: Login Form ── */}
                <div className="flex min-h-screen w-full flex-col lg:w-1/2">
                    <AuthHeader />

                    <div className="my-auto flex w-full justify-center px-6 py-10 sm:px-10 lg:px-12">
                        <LoginForm errorMessage={errorMessage} />
                    </div>
                </div>
            </div>
        </main>
    );
}
