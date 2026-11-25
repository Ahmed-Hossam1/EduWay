"use client";

import { DoubleSide } from "three";
import { PlanetLook } from "../../types";

type PlanetShapeProps = {
    look: PlanetLook;
};

/**
 * ONLY the shape of a planet (no movement here): a ball, a cube, a gem...
 * Every shape uses the same material: the planet color + a little shine.
 * flatShading → the faces of the gems / cube look sharp instead of smooth.
 */
export function PlanetShape({ look }: PlanetShapeProps) {
    const { shape, color, size } = look;
    const material = (
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} flatShading={shape !== "sphere"} />
    );

    // a ball with a ring around it (like Saturn)
    if (shape === "ringed") {
        return (
            <group>
                <mesh>
                    <sphereGeometry args={[size, 32, 32]} />
                    {material}
                </mesh>
                <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                    <ringGeometry args={[size * 1.4, size * 1.9, 48]} />
                    <meshBasicMaterial color={color} side={DoubleSide} transparent opacity={0.6} />
                </mesh>
            </group>
        );
    }

    // a gem with 20 faces
    if (shape === "ico") {
        return (
            <mesh>
                <icosahedronGeometry args={[size, 0]} />
                {material}
            </mesh>
        );
    }

    // a gem with 8 faces (a diamond)
    if (shape === "octa") {
        return (
            <mesh>
                <octahedronGeometry args={[size, 0]} />
                {material}
            </mesh>
        );
    }

    // a cube (its side = size × 1.4, so it looks as big as the balls)
    if (shape === "cube") {
        return (
            <mesh>
                <boxGeometry args={[size * 1.4, size * 1.4, size * 1.4]} />
                {material}
            </mesh>
        );
    }

    // a knot (a tube tied around itself)
    if (shape === "knot") {
        return (
            <mesh>
                <torusKnotGeometry args={[size * 0.7, size * 0.25, 64, 8]} />
                {material}
            </mesh>
        );
    }

    // "sphere": a simple ball
    return (
        <mesh>
            <sphereGeometry args={[size, 32, 32]} />
            {material}
        </mesh>
    );
}
