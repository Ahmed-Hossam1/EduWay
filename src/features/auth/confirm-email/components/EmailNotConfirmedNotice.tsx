"use client";
import { MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResendConfirmation } from "../hooks/useResendConfirmation";

type EmailNotConfirmedNoticeProps = {
    email: string; // the email typed in the login form
};

// On the login form: the password is right, but the email is not confirmed yet
export function EmailNotConfirmedNotice({ email }: EmailNotConfirmedNoticeProps) {
    const { mutate: resend, isPending } = useResendConfirmation();

    return (
        <div className="rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
            <p className="flex items-start gap-2 font-medium">
                <MailWarning className="mt-0.5 size-4 shrink-0" />
                Please confirm your email first.
            </p>
            <p className="mt-1 pl-6 text-xs">
                Click the link we sent to <span className="font-semibold">{email}</span>. Can&apos;t find it?
            </p>

            <Button
                variant="outline"
                size="sm"
                rounded="lg"
                className="mt-3 ml-6 bg-background"
                isLoading={isPending}
                onClick={() => resend({ email })}
            >
                {isPending ? "Sending..." : "Resend confirmation email"}
            </Button>
        </div>
    );
}
