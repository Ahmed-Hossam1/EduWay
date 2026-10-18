"use client";
import Link from "next/link";
import { ArrowLeft, MailCheck, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResendConfirmation } from "../hooks/useResendConfirmation";

type CheckEmailViewProps = {
    email: string; // the email the user signed up with
};

// After signing up (when "Confirm email" is on): "Check your inbox" + send the email again
export function CheckEmailView({ email }: CheckEmailViewProps) {
    const { mutate: resend, isPending } = useResendConfirmation();

    return (
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 text-center shadow-lg sm:max-w-md sm:p-9">
            {/* Icon */}
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-950/20">
                <MailCheck className="size-6" />
            </div>

            {/* Text */}
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">Check your inbox</h1>
            <p className="mt-2 text-sm text-muted-foreground">
                We sent a confirmation link to <span className="font-semibold text-foreground">{email}</span>. Click
                it to activate your account.
            </p>

            <p className="mt-5 rounded-xl bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
                Didn&apos;t get the email? Check your spam folder, or send it again.
            </p>

            {/* Send again */}
            <Button
                variant="outline"
                rounded="xl"
                className="mt-5 h-11 w-full font-semibold"
                isLoading={isPending}
                onClick={() => resend({ email })}
            >
                {isPending ? (
                    "Sending..."
                ) : (
                    <>
                        <RotateCw className="size-4" />
                        Resend email
                    </>
                )}
            </Button>

            {/* Back to login */}
            <Link
                href="/auth/login"
                className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
            >
                <ArrowLeft className="size-4" />
                Back to sign in
            </Link>
        </div>
    );
}
