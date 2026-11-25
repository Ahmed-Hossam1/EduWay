import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryPlanet } from "../types";

type PlanetDetailsCardProps = {
    planet: CategoryPlanet; // the selected planet
};

// The card next to the planets: what the selected category is about + a link to its courses
export function PlanetDetailsCard({ planet }: PlanetDetailsCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            {/* the icon has the planet color → you see which planet is selected */}
            <div className="flex items-center gap-3">
                <span
                    className="flex size-11 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: planet.look.color }}
                >
                    <planet.icon className="size-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{planet.name}</h3>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">{planet.description}</p>

            <ul className="mt-4 space-y-2">
                {planet.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="size-4 text-primary" />
                        {topic}
                    </li>
                ))}
            </ul>

            <Button asChild className="mt-6">
                <Link href={`/courses?category=${planet.slug}`}>
                    Explore {planet.name}
                    <ArrowRight />
                </Link>
            </Button>
        </div>
    );
}
