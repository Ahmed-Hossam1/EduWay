"use client";

import { useState } from "react";

const STARS_COUNT = 160;

// x, y, z of every star, one after the other: [x1, y1, z1, x2, y2, z2, ...] (the shape Three.js wants)
function createStarPositions() {
    const positions = new Float32Array(STARS_COUNT * 3);
    for (let i = 0; i < STARS_COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30; // x: -15 → 15
        positions[i * 3 + 1] = (Math.random() - 0.5) * 16; // y: -8 → 8
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 6; // z: mostly behind the sun
    }
    return positions;
}

// Small gray dots in the background. They don't move (the camera moves → they look like they do).
export function Stars() {
    // useState(() => ...) → the random places are made ONCE, not again on every render
    const [positions] = useState(createStarPositions);

    return (
        <points>
            <bufferGeometry>
                {/* attach="attributes-position" → geometry.attributes.position; args = [the numbers, 3 per star] */}
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial color="#888780" size={0.05} transparent opacity={0.6} />
        </points>
    );
}
