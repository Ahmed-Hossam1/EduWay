import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryPlanet } from "../types";

type CategoryCardsFallbackProps = {
    planets: CategoryPlanet[];
};

// Small screens: the same categories as simple cards (no 3D, no Three.js download)
export function CategoryCardsFallback({ planets }: CategoryCardsFallbackProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {planets.map((planet) => (
                <Link
                    key={planet.id}
                    href={`/courses?category=${planet.slug}`}
                    className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
                >
                    {/* the same color as its planet on big screens */}
                    <span
                        className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: planet.look.color }}
                    >
                        <planet.icon className="size-5" />
                    </span>

                    <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 font-semibold text-foreground">
                            {planet.name}
                            <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5" />
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{planet.description}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}
