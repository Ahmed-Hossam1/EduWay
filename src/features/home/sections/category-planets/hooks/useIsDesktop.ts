import { useSyncExternalStore } from "react";

// The same width as Tailwind "lg" (the section shows the planets from lg up)
const DESKTOP_QUERY = "(min-width: 1024px)";

// React reads the screen width again every time it crosses 1024px
function subscribe(onChange: () => void) {
    const media = window.matchMedia(DESKTOP_QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}

/**
 * true on a big screen (≥ 1024px). The server has no window → false.
 * Used to load Three.js ONLY on big screens (phones never download it).
 *
 *   const isDesktop = useIsDesktop();
 */
export function useIsDesktop() {
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(DESKTOP_QUERY).matches,
        () => false,
    );
}
