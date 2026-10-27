/**
 * The @modal slot (a parallel route) when no modal is open → nothing.
 * After a refresh, Next.js has no "intercepted" page to show here → this file is used (without it: 404).
 */
export default function ModalSlot() {
    return null;
}
