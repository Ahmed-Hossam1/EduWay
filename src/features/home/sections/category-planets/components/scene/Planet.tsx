"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils, Vector3 } from "three";
import { CategoryPlanet } from "../../types";
import { PlanetShape } from "./PlanetShape";

type PlanetProps = {
    planet: CategoryPlanet;
    isSelected: boolean;
    onSelect: () => void;
    getLabel: () => HTMLSpanElement | null; // its name (HTML on top of the canvas, see PlanetLabel)
};

// How big a planet gets (1 = its normal size). It grows SLOWLY to these sizes (lerp below).
const SELECTED_SCALE = 1.7;
const HOVER_SCALE = 1.3;
const SELECTED_SLOW_DOWN = 0.35; // the selected planet moves at 35% of its speed → easy to look at
const LABEL_GAP = 0.35; // the space between the planet and its name

/**
 * One planet: goes around the sun, turns on itself, grows when hovered / selected, moves its name.
 * It knows nothing about the card: it only tells "I was clicked" (onSelect).
 */
export function Planet({ planet, isSelected, onSelect, getLabel }: PlanetProps) {
    const { look } = planet;
    const [isHovered, setIsHovered] = useState(false);

    const orbitRef = useRef<Group>(null); // moves around the sun
    const bodyRef = useRef<Group>(null); // turns on itself + grows
    const angle = useRef(look.startAngle); // where it is on its orbit now (radians)
    const labelPoint = useRef(new Vector3()); // a point above the planet (reused on every frame)

    useFrame((state, delta) => {
        const orbitGroup = orbitRef.current;
        const body = bodyRef.current;
        if (!orbitGroup || !body) return;

        // 1- move forward on the orbit (slower when selected)
        const speed = isSelected ? look.speed * SELECTED_SLOW_DOWN : look.speed;
        angle.current += delta * speed;

        // 2- the place on the circle: x = cos(angle) × orbit, z = sin(angle) × orbit
        //    + a small up / down wave (y), so the movement doesn't look flat
        orbitGroup.position.set(
            Math.cos(angle.current) * look.orbit,
            Math.sin(angle.current * 2) * 0.12,
            Math.sin(angle.current) * look.orbit,
        );

        // 3- turn on itself
        body.rotation.y += delta * 0.8;
        body.rotation.x += delta * 0.3;

        // 4- grow / shrink smoothly: lerp = go 12% of the way to the target size on every frame
        let targetScale = 1;
        if (isHovered) targetScale = HOVER_SCALE;
        if (isSelected) targetScale = SELECTED_SCALE;
        const scale = MathUtils.lerp(body.scale.x, targetScale, 0.12);
        body.scale.setScalar(scale);

        // 5- put its name above it ON THE SCREEN:
        //    a 3D point above the planet → project() → x / y from -1 to 1 → pixels of the canvas
        const label = getLabel();
        if (label) {
            const point = labelPoint.current.copy(orbitGroup.position);
            point.y += look.size * 1.5 * scale + LABEL_GAP;
            point.project(state.camera);

            const x = ((point.x + 1) / 2) * state.size.width;
            const y = ((1 - point.y) / 2) * state.size.height;
            // translate(-50%, -100%) → the middle-bottom of the name sits on that point
            label.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
        }
    });

    return (
        <group ref={orbitRef}>
            {/* the planet itself: hover / click work on the 3D shape (Three.js finds what is under the mouse) */}
            <group
                ref={bodyRef}
                onClick={(event) => {
                    event.stopPropagation(); // only the planet in front, not the one behind it
                    onSelect();
                }}
                onPointerOver={(event) => {
                    event.stopPropagation();
                    setIsHovered(true);
                    document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                    setIsHovered(false);
                    document.body.style.cursor = "";
                }}
            >
                <PlanetShape look={look} />
            </group>
        </group>
    );
}
