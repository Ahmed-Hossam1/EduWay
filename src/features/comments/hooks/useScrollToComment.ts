"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Subscribes to browser URL hash changes.
 *
 * React re-renders the component when the URL hash changes,
 * allowing the component to read the latest window.location.hash.
 *
 * @param onChange - Callback React uses to check for an updated snapshot.
 * @returns A cleanup function that removes the hashchange listener.
 */
const subscribeToHash = (onChange: () => void) => {
    // Listen for changes to the URL hash, e.g. #review-123 → #review-456.
    window.addEventListener("hashchange", onChange);

    // Remove the listener when React unsubscribes.
    // Output: A cleanup function (void when executed).
    return () => window.removeEventListener("hashchange", onChange);
};

/**
 * Reads a comment ID from the URL hash and scrolls to the relevant comment
 * or its parent section.
 *
 * Supported URL patterns:
 * - #<prefix>-<id>  → Focus a specific comment.
 * - #<sectionId>    → Scroll to the parent section without focusing a comment.
 * - Other hashes    → Return null and do not trigger hash-based scrolling.
 *
 * If the target comment is not rendered, the hook scrolls to the parent section.
 *
 * @param prefix - Prefix used in comment element IDs and URL hashes.
 *                 Example: "review" for #review-123.
 * @param sectionId - DOM ID of the parent section.
 *                    Example: "reviews" for #reviews.
 *
 * @returns The comment ID extracted from the hash, or null if no matching
 *          comment ID exists.
 *
 * @example
 * const focusedId = useScrollToComment("review", "reviews");
 *
 * // URL: /courses/react#review-123
 * // Returns: "123"
 *
 * // URL: /courses/react#reviews
 * // Returns: null, and scrolls to the reviews section.
 *
 * // URL: /courses/react
 * // Returns: null.
 */
export const useScrollToComment = (
    prefix: string,
    sectionId: string
): string | null => {
    // Subscribe to URL hash changes and read the current hash.
    const hash = useSyncExternalStore(
        subscribeToHash,

        // Client snapshot: the current browser URL hash.
        // Example output: "#review-123".
        () => window.location.hash,

        // Server snapshot: the hash is unavailable during SSR.
        // Output: "" (an empty string), preventing an initial hydration mismatch.
        () => ""
    );

    // Build the expected prefix for a comment hash.
    // Example: prefix = "review" → start = "#review-".
    const start = `#${prefix}-`;

    // Extract the comment ID only when the hash matches the expected prefix.
    // Example: hash = "#review-123" → focusedId = "123".
    // Example: hash = "#reviews" → focusedId = null.
    const focusedId = hash.startsWith(start)
        ? hash.slice(start.length)
        : null;

    useEffect(() => {
        // If the hash points directly to the section, scroll to that section.
        // Example: #reviews → scroll to the element with id="reviews".
        if (window.location.hash === `#${sectionId}`) {
            document.getElementById(sectionId)?.scrollIntoView();
            return;
        }

        // If the hash identifies a comment, try to find that comment in the DOM.
        if (focusedId) {
            const comment = document.getElementById(
                `${prefix}-${focusedId}`
            );

            // Scroll to the comment when available.
            // Otherwise, fall back to the parent section.
            (comment ?? document.getElementById(sectionId))
                ?.scrollIntoView({ block: "center" });
        }
    }, [focusedId, prefix, sectionId]);

    // Return the extracted comment ID, or null.
    // The caller can use it to highlight the comment or open its replies.
    return focusedId;
};