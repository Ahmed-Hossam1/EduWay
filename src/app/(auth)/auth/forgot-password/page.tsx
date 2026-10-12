import ForgotPasswordForm from "@/features/auth/forgot-password/components/ForgotPasswordForm";
import { AuthHeader } from "@/features/auth/shared/components";

export const metadata = {
    title: "Forgot Password",
    description: "Reset your EduWay password.",
};

export default function ForgotPasswordPage() {
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
            {/* Background decoration */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 left-1/2 size-130 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[22px_22px] opacity-50 mask-[radial-gradient(ellipse_at_center,black_20%,transparent_65%)]" />
            </div>

            <div className="relative flex min-h-screen flex-col">
                <AuthHeader />

                <div className="my-auto flex w-full justify-center px-6 py-10 sm:px-10">
                    <ForgotPasswordForm />
                </div>
            </div>
        </main>
    );
}
