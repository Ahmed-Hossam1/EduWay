import { LoginHero } from "@/features/auth/login/components/LoginHero";
import { LoginForm } from "@/features/auth/login/components/LoginForm";
import { AuthHeader } from "@/features/auth/shared/components/AuthHeader";

export const metadata = {
    title: "Sign In",
    description: "Sign in to your EduWay account and continue your learning journey.",
};

type Params = {
    searchParams: Promise<{ error?: string }>;
};

// Google / GitHub sign-in errors have their own page: /auth/oauth-error
// ?error=confirm_link_expired → an old / used confirm-signup link (from /api/auth/confirm)
export default async function LoginPage({ searchParams }: Params) {
    const { error } = await searchParams;

    return (
        <main className="min-h-screen w-full bg-background text-foreground">
            <div className="flex min-h-screen flex-col lg:flex-row">
                {/* ── Left: Hero / Branding ── */}
                <LoginHero />

                {/* ── Right: Login Form ── */}
                <div className="flex min-h-screen w-full flex-col lg:w-1/2">
                    <AuthHeader />

                    <div className="my-auto flex w-full justify-center px-6 py-10 sm:px-10 lg:px-12">
                        <LoginForm confirmLinkExpired={error === "confirm_link_expired"} />
                    </div>
                </div>
            </div>
        </main>
    );
}
