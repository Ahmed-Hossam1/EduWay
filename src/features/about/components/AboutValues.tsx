import { aboutValues } from "../data";

// "Our mission" + "Our vision": 2 cards side by side
export function AboutValues() {
    return (
        <section className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2">
                {aboutValues.map((value) => (
                    <div key={value.id} className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
                        <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-accent text-accent-foreground">
                            <value.icon className="size-6" />
                        </div>
                        <h2 className="mt-5 text-xl font-bold text-foreground sm:text-2xl">{value.title}</h2>
                        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{value.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
