"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Mesh } from "three";

const SUN_RADIUS = 0.85;

// The sun in the middle: a glowing purple ball + a thin ring around it. Both turn slowly.
export function Sun() {
    const ballRef = useRef<Mesh>(null);
    const ringRef = useRef<Mesh>(null);

    // useFrame = runs on EVERY frame (~60 times a second). delta = seconds since the last frame,
    // so the speed is the same on a fast and a slow screen.
    useFrame((_state, delta) => {
        if (ballRef.current) ballRef.current.rotation.y += delta * 0.3;
        if (ringRef.current) ringRef.current.rotation.z += delta * 0.2;
    });

    return (
        <group>
            {/* the ball: sphereGeometry args = [radius, width segments, height segments] (more = smoother) */}
            <mesh ref={ballRef}>
                <sphereGeometry args={[SUN_RADIUS, 48, 48]} />
                {/* emissive = the color it gives by itself → it glows even without light on it */}
                <meshStandardMaterial color="#7F77DD" emissive="#534AB7" emissiveIntensity={0.55} roughness={0.4} />
            </mesh>

            {/* the ring: a flat circle with a hole (inner radius, outer radius), tilted to look 3D */}
            <mesh ref={ringRef} rotation={[Math.PI / 2.3, 0, 0]}>
                <ringGeometry args={[SUN_RADIUS + 0.2, SUN_RADIUS + 0.27, 64]} />
                <meshBasicMaterial color="#AFA9EC" side={DoubleSide} transparent opacity={0.7} />
            </mesh>
        </group>
    );
}
