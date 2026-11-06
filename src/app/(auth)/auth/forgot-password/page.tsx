import { ForgotPasswordForm } from "@/features/auth/forgot-password/components/ForgotPasswordForm";

export const metadata = {
    title: "Forgot Password",
    description: "Reset your EduWay password.",
};

type Params = {
    searchParams: Promise<{ error?: string | string[] }>;
};

export default async function ForgotPasswordPage({ searchParams }: Params) {
    // /api/auth/confirm sends people here when their reset link is old / already used
    const { error } = await searchParams;

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
            {/* Background decoration */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 left-1/2 size-130 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[22px_22px] opacity-50 mask-[radial-gradient(ellipse_at_center,black_20%,transparent_65%)]" />
            </div>

            {/* the card has its own logo + "Back to sign in" → no AuthHeader here */}
            <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-10">
                <ForgotPasswordForm linkExpired={error === "link_expired"} />
            </div>
        </main>
    );
}
