import LoginHero from "@/features/login/components/LoginHero";
import LoginForm from "@/features/login/components/LoginForm";
import { AuthHeader } from "../shared/components";

export const metadata = {
    title: "Sign In",
    description: "Sign in to your EduWay account and continue your learning journey.",
};

export default function LoginPage() {
    return (
        <main className="min-h-screen w-full bg-background text-foreground">
            <div className="flex min-h-screen flex-col lg:flex-row">
                {/* ── Left: Hero / Branding ── */}
                <LoginHero />

                {/* ── Right: Login Form ── */}
                <div className="flex min-h-screen w-full flex-col lg:w-1/2">
                    <AuthHeader />

                    <div className="my-auto flex w-full justify-center px-6 py-10 sm:px-10 lg:px-12">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </main>
    );
}