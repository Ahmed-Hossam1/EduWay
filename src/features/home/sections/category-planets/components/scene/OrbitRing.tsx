"use client";

import { Line } from "@react-three/drei";

type OrbitRingProps = {
    radius: number; // how far from the sun
    isHighlighted: boolean; // the selected planet is on this orbit → brighter
};

const POINTS_COUNT = 96; // more points = a rounder circle

// One orbit: a circle on the floor (x / z), made of many small straight lines
export function OrbitRing({ radius, isHighlighted }: OrbitRingProps) {
    // a point every (360° / 96) on the circle: x = cos(angle) * radius, z = sin(angle) * radius
    const points: [number, number, number][] = [];
    for (let i = 0; i <= POINTS_COUNT; i++) {
        const angle = (i / POINTS_COUNT) * Math.PI * 2;
        points.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }

    return (
        <Line
            points={points}
            color={isHighlighted ? "#AFA9EC" : "#888780"}
            lineWidth={1}
            transparent
            opacity={isHighlighted ? 0.9 : 0.35}
        />
    );
}
