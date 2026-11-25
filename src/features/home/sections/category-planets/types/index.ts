import { LucideIcon } from "lucide-react";

// The 3D shape of a planet (each category has its own, so they look different)
export type PlanetShapeName = "sphere" | "ringed" | "ico" | "octa" | "cube" | "knot";

// How a planet looks and moves in the 3D scene
export interface PlanetLook {
    shape: PlanetShapeName;
    color: string; // "#1D9E75"
    size: number; // the radius of the planet (the sun is 0.85)
    orbit: number; // how far from the sun
    speed: number; // how fast it goes around (radians per second)
    startAngle: number; // where it starts on its orbit (radians) → planets on the same orbit don't overlap
}

// One planet = one category (fixed on the frontend, no data from the backend)
export interface CategoryPlanet {
    id: string;
    name: string; // "Web Development" (on the card)
    shortName: string; // "Web dev" (the small label above the planet)
    slug: string; // the real category slug → /courses?category=<slug>
    description: string;
    topics: string[]; // 3 example topics on the card
    icon: LucideIcon;
    look: PlanetLook;
}
