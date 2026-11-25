"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryPlanets } from "../data/categoryPlanets";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { CategoryCardsFallback } from "./CategoryCardsFallback";
import { PlanetDetailsCard } from "./PlanetDetailsCard";

// Three.js is big → its code is downloaded only when PlanetsScene is shown for the first time
// ssr: false → it runs in the browser only (the server has no WebGL)
const PlanetsScene = dynamic(() => import("./scene/PlanetsScene").then((module) => module.PlanetsScene), {
    ssr: false,
    loading: () => <Skeleton className="size-full rounded-3xl" />,
});

/**
 * Which planet is selected (the card shows it) + which view to show:
 *   small screens → CategoryCardsFallback (simple cards, no Three.js)
 *   big screens   → PlanetDetailsCard + PlanetsScene (the 3D planets)
 * Both are in the HTML and CSS hides one (no jump on load); the 3D scene itself is added only on big screens.
 *
 * It reads the planets itself (not from a prop): they have icons (functions),
 * and a server component can't send functions to a client component.
 */
export function CategoryPlanets() {
    const planets = categoryPlanets;
    const [selectedId, setSelectedId] = useState(planets[0].id);
    const isDesktop = useIsDesktop();

    const selectedPlanet = planets.find((planet) => planet.id === selectedId) ?? planets[0];

    return (
        <>
            {/* small screens */}
            <div className="lg:hidden">
                <CategoryCardsFallback planets={planets} />
            </div>

            {/* big screens: the card on the left, the planets on the right */}
            <div className="hidden items-center gap-8 lg:grid lg:grid-cols-[2fr_3fr]">
                <PlanetDetailsCard planet={selectedPlanet} />

                <div className="h-110 rounded-3xl border border-border bg-muted/30">
                    {isDesktop && <PlanetsScene planets={planets} selectedId={selectedId} onSelect={setSelectedId} />}
                </div>
            </div>
        </>
    );
}
