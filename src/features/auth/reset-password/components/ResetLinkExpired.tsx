import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// /auth/reset-password opened without a valid email link (old link, already used, or typed by hand)
export function ResetLinkExpired() {
    return (
        <Card className="block w-full max-w-sm rounded-2xl p-7 text-center shadow-lg sm:max-w-md sm:p-9">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-8 ring-amber-50/50 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-950/20">
                <Clock className="size-6" />
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">This link has expired</h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Reset links work once and for 1 hour. Request a new one to choose your password.
            </p>

            <Button rounded="xl" className="mt-7 h-11 w-full font-semibold" asChild>
                <Link href="/auth/forgot-password">Request a new link</Link>
            </Button>
        </Card>
    );
}
