"use client";

import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

// Where the camera stands when the mouse is in the middle (a bit above, looking down at the sun)
export const CAMERA_START: [number, number, number] = [0, 5.6, 10.8];

const MOVE_X = 3; // mouse at the far left / right → the camera moves 3 to the side
const MOVE_Y = 2; // mouse at the top / bottom → the camera moves 2 up / down

/**
 * The camera follows the mouse a little → the scene tilts (it feels 3D).
 * It draws nothing: it only moves the camera on every frame.
 */
export function CameraRig() {
    useFrame((state) => {
        // state.pointer = the mouse on the canvas: x and y from -1 to 1 (0 = the middle)
        const targetX = CAMERA_START[0] + state.pointer.x * MOVE_X;
        const targetY = CAMERA_START[1] - state.pointer.y * MOVE_Y;

        // lerp → the camera goes 5% of the way on every frame = a soft, late movement (not a jump)
        state.camera.position.x = MathUtils.lerp(state.camera.position.x, targetX, 0.05);
        state.camera.position.y = MathUtils.lerp(state.camera.position.y, targetY, 0.05);

        // always look at the sun (the middle of the scene)
        state.camera.lookAt(0, 0, 0);
    });

    return null;
}
