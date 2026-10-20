import Link from "next/link";
import { BookOpen, FileText, MessageSquareWarning, RotateCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OnboardingHeader } from "./OnboardingHeader";
import { ReapplyButton } from "./ReapplyButton";

// What the teacher can do now
const NEXT_STEPS = [
    {
        icon: FileText,
        title: "Fix your profile",
        description: "Read the reason above and update the parts our team asked for.",
    },
    {
        icon: RotateCw,
        title: "Apply again",
        description: "Your old answers are saved: change what you need and send it again.",
    },
    {
        icon: BookOpen,
        title: "Keep learning",
        description: "Your account still works: buy and follow any course as a student.",
    },
];

type OnboardingRejectedProps = {
    firstName: string;
    reason: string | null; // the admin's reason (null if we don't have one)
};

// /account/rejected — an admin reviewed the teacher profile and didn't approve it
export function OnboardingRejected({ firstName, reason }: OnboardingRejectedProps) {
    return (
        <main className="min-h-screen w-full bg-background text-foreground flex flex-col">
            <OnboardingHeader />

            <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
                <Card className="w-full max-w-lg rounded-2xl border-border bg-card p-6 text-center shadow-xl shadow-primary/5 sm:p-9 ring-0">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                        <XCircle className="size-8" />
                    </div>

                    <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">
                        {firstName ? `Sorry, ${firstName}. ` : ""}Your teacher profile wasn&apos;t approved
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Our team reviewed your application and couldn&apos;t approve it this time. This is not the end:
                        you can fix it and apply again.
                    </p>

                    {/* The reason from the admin */}
                    {reason && (
                        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-left dark:border-rose-900/60 dark:bg-rose-950/30">
                            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                                <MessageSquareWarning className="size-4" />
                                Reason from our team
                            </p>
                            <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-foreground">{reason}</p>
                        </div>
                    )}

                    {/* Next steps */}
                    <ol className="mt-7 space-y-4 text-left">
                        {NEXT_STEPS.map((step) => (
                            <li key={step.title} className="flex items-start gap-3">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-foreground">
                                    <step.icon className="size-4" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                                    <p className="text-xs text-muted-foreground">{step.description}</p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                        <ReapplyButton />
                        <Button variant="outline" rounded="xl" className="h-11 w-full sm:flex-1" asChild>
                            <Link href="/contact">Contact support</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        </main>
    );
}
