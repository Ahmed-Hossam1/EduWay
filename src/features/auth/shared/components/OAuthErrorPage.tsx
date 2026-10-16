import Link from "next/link";
import { RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AuthHeader from "./AuthHeader";

type OAuthErrorPageProps = {
    message: string; // what went wrong (from OAUTH_ERROR_MESSAGES)
};

// /auth/oauth-error — Google / GitHub sign-in failed
export function OAuthErrorPage({ message }: OAuthErrorPageProps) {
    return (
        <main className="flex min-h-screen w-full flex-col bg-background text-foreground">
            <AuthHeader />

            <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
                <Card className="w-full max-w-md gap-0 rounded-2xl p-6 text-center shadow-lg sm:p-9">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <XCircle className="size-8" />
                    </div>

                    <h1 className="mt-5 text-2xl font-black tracking-tight">Sign-in failed</h1>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{message}</p>

                    <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                        <Button rounded="xl" className="h-11 w-full sm:flex-1" asChild>
                            <Link href="/auth/login">
                                <RotateCcw />
                                Try again
                            </Link>
                        </Button>
                        <Button variant="outline" rounded="xl" className="h-11 w-full sm:flex-1" asChild>
                            <Link href="/">Back to home</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        </main>
    );
}
