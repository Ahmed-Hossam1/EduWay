import { aboutFeatures } from "../data";

// "What makes EduWay different": 4 real features of the platform
export function AboutFeatures() {
    return (
        <section className="border-y border-border/60 bg-muted/20 py-12 sm:py-16">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        What makes <span className="text-primary">EduWay</span> different
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                        Everything is built around one goal: helping you actually finish what you start.
                    </p>
                </div>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {aboutFeatures.map((feature) => (
                        <div
                            key={feature.id}
                            className="rounded-2xl border border-border bg-card p-6 shadow-xs transition-shadow hover:shadow-md"
                        >
                            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <feature.icon className="size-5" />
                            </div>
                            <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                            <p className="mt-1.5 text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
