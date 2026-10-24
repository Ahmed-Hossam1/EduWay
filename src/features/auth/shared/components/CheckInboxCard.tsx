import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

type CheckInboxCardProps = {
    description: ReactNode; // "We sent a link to <email>..."
    note: ReactNode; // the gray box: "Didn't get the email? Check your spam folder..."
    action?: ReactNode; // optional button under the note (e.g. "Resend email")
};

/**
 * "Check your inbox" after we sent an email (forgot password, confirm signup).
 * The same card everywhere; each page gives its own texts + action.
 */
export function CheckInboxCard({ description, note, action }: CheckInboxCardProps) {
    return (
        <Card className="block w-full max-w-sm rounded-2xl p-7 text-center shadow-lg sm:max-w-md sm:p-9">
            {/* Icon */}
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-950/20">
                <MailCheck className="size-6" />
            </div>

            {/* Text */}
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">Check your inbox</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>

            <p className="mt-5 rounded-xl bg-muted/60 px-4 py-3 text-xs text-muted-foreground">{note}</p>

            {action}

            {/* Back to login */}
            <Link
                href="/auth/login"
                className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
            >
                <ArrowLeft className="size-4" />
                Back to sign in
            </Link>
        </Card>
    );
}
