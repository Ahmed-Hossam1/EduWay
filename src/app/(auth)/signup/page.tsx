import SignUpHero from "@/features/signup/components/SignUpHero";
import SignupForm from "@/features/signup/components/SignupForm";
import { AuthHeader } from "../shared/components";

export const metadata = {
    title: "Sign Up",
    description: "Create your EduWay account and start your learning journey today.",
};

export default function SignupPage() {
    return (
        <main className="h-full w-full bg-background text-foreground">
            <div className="flex h-full flex-col lg:flex-row">
                {/* ── Left: Hero / Branding ── */}
                <SignUpHero />

                {/* ── Right: Signup Form ── */}
                <div className="flex min-h-screen w-full flex-col lg:w-1/2">
                    <AuthHeader />

                    <div className="my-auto flex w-full justify-center px-6 py-10 sm:px-10 lg:px-12">
                        <SignupForm />
                    </div>
                </div>
            </div>
        </main>
    );
}