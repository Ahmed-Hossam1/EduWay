import Link from "next/link";
import { ArrowLeft, KeyRound, Mail, Send } from "lucide-react";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// UI only — the logic (send the reset email with Supabase) will be added later
export default function ForgotPasswordForm() {
    return (
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-lg sm:max-w-md sm:p-9">
            {/* Icon */}
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5">
                <KeyRound className="size-6" />
            </div>

            {/* Header */}
            <div className="mt-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
                    Forgot your password?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    No worries! Enter the email you signed up with and we&apos;ll send you a link to reset your password.
                </p>
            </div>

            {/* Form */}
            <form className="mt-7 space-y-4">
                <Input
                    id="forgot-password-email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    leftIcon={<Mail className="size-4" />}
                    variant="outline"
                    Size="md"
                    rounded="lg"
                    fullWidth
                    autoComplete="email"
                />

                <Button type="submit" size="lg" className="mt-2 h-11 w-full rounded-xl font-semibold">
                    <span>Send reset link</span>
                    <Send className="size-4" />
                </Button>
            </form>

            {/* Help text */}
            <p className="mt-5 rounded-xl bg-muted/60 px-4 py-3 text-center text-xs text-muted-foreground">
                Didn&apos;t get the email? Check your spam folder or try again in a few minutes.
            </p>

            {/* Back to login */}
            <Link
                href="/login"
                className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
            >
                <ArrowLeft className="size-4" />
                Back to sign in
            </Link>
        </div>
    );
}
