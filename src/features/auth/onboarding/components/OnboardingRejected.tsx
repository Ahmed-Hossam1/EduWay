import Link from "next/link";
import { BookOpen, FileText, Mail, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OnboardingHeader } from "./OnboardingHeader";

// What the teacher can do now
const NEXT_STEPS = [
    {
        icon: FileText,
        title: "Check your profile",
        description: "A clear bio, real skills and proof of your experience help a lot.",
    },
    {
        icon: Mail,
        title: "Talk to our team",
        description: "Contact us to know why, or to ask for a second review.",
    },
    {
        icon: BookOpen,
        title: "Keep learning",
        description: "Your account still works: buy and follow any course as a student.",
    },
];

// /account/rejected — an admin reviewed the teacher profile and didn't approve it
export function OnboardingRejected({ firstName }: { firstName: string }) {
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
                        here is what you can do next.
                    </p>

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
                        <Button rounded="xl" className="h-11 w-full sm:flex-1" asChild>
                            <Link href="/contact">Contact support</Link>
                        </Button>
                        <Button variant="outline" rounded="xl" className="h-11 w-full sm:flex-1" asChild>
                            <Link href="/courses">Browse courses</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        </main>
    );
}
