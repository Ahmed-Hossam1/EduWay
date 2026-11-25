"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CategoryPlanet } from "../../types";
import { CameraRig, CAMERA_START } from "./CameraRig";
import { OrbitRing } from "./OrbitRing";
import { Planet } from "./Planet";
import { PlanetLabel } from "./PlanetLabel";
import { Stars } from "./Stars";
import { Sun } from "./Sun";

type PlanetsSceneProps = {
    planets: CategoryPlanet[];
    selectedId: string;
    onSelect: (planetId: string) => void;
};

/**
 * The whole 3D scene: puts the pieces together, it has no logic of its own.
 *   <Canvas>  = the <canvas> on the page + the Three.js scene + the camera + the drawing loop
 *   the names = HTML on top of the canvas; every Planet moves its own name on every frame
 * It fills its parent → the parent decides the size.
 */
export function PlanetsScene({ planets, selectedId, onSelect }: PlanetsSceneProps) {
    // the <span> of every name, by planet id (filled by the ref callbacks below)
    const labels = useRef<Record<string, HTMLSpanElement | null>>({});

    // one ring per orbit (2 planets can share an orbit → no double rings)
    const orbits = [...new Set(planets.map((planet) => planet.look.orbit))];
    const selectedOrbit = planets.find((planet) => planet.id === selectedId)?.look.orbit;

    return (
        <div className="relative size-full overflow-hidden">
            {/* dpr = pixel ratio: sharp on retina screens, but never more than 2 (faster)
                gl alpha → a see-through background: the section color shows behind (light + dark mode) */}
            <Canvas camera={{ position: CAMERA_START, fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
                {/* the lights: a soft light everywhere + a light from the top right + a light from the sun */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[3, 6, 5]} intensity={1.5} />
                <pointLight position={[0, 0, 0]} intensity={15} />

                <CameraRig />
                <Stars />
                <Sun />

                {orbits.map((orbit) => (
                    <OrbitRing key={orbit} radius={orbit} isHighlighted={orbit === selectedOrbit} />
                ))}

                {planets.map((planet) => (
                    <Planet
                        key={planet.id}
                        planet={planet}
                        isSelected={planet.id === selectedId}
                        onSelect={() => onSelect(planet.id)}
                        getLabel={() => labels.current[planet.id] ?? null}
                    />
                ))}
            </Canvas>

            {/* the names, on top of the canvas */}
            {planets.map((planet) => (
                <PlanetLabel
                    key={planet.id}
                    ref={(element) => {
                        labels.current[planet.id] = element;
                    }}
                    name={planet.shortName}
                    isSelected={planet.id === selectedId}
                />
            ))}
        </div>
    );
}
