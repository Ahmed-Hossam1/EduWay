import { AuthHeader } from "@/features/auth/shared/components/AuthHeader";
import { ResetPasswordForm } from "@/features/auth/reset-password/components/ResetPasswordForm";
import { ResetLinkExpired } from "@/features/auth/reset-password/components/ResetLinkExpired";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
    title: "Reset Password",
    robots: { index: false },
};

// The reset email link → /api/auth/confirm (logs the user in) → here.
// No session = the link wasn't used, expired, or the page was opened by hand.
export default async function ResetPasswordPage() {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
            {/* Background decoration (same as forgot password) */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 left-1/2 size-130 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[22px_22px] opacity-50 mask-[radial-gradient(ellipse_at_center,black_20%,transparent_65%)]" />
            </div>

            <div className="relative flex min-h-screen flex-col">
                <AuthHeader />

                <div className="my-auto flex w-full justify-center px-6 py-10 sm:px-10">
                    {user ? <ResetPasswordForm /> : <ResetLinkExpired />}
                </div>
            </div>
        </main>
    );
}
