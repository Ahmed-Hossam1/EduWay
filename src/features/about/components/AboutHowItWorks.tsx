import Link from "next/link";
import { Button } from "@/components/ui/button";
import { aboutPaths } from "../data";

// "How it works": the steps for students and for instructors, side by side
export function AboutHowItWorks() {
    return (
        <section className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How it works</h2>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
                {aboutPaths.map((path) => (
                    <div key={path.id} className="flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-foreground sm:text-xl">{path.title}</h3>

                        {/* the steps: a number in a circle + the words */}
                        <ol className="mt-6 flex-1 space-y-5">
                            {path.steps.map((step, index) => (
                                <li key={step.id} className="flex gap-4">
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-foreground">{step.title}</p>
                                        <p className="text-sm text-muted-foreground">{step.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>

                        <Button
                            asChild
                            variant={path.id === "students" ? "default" : "outline"}
                            className="mt-8 self-start"
                        >
                            <Link href={path.cta.href}>{path.cta.label}</Link>
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
}
