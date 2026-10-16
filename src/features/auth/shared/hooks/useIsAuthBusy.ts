"use client";
import { useIsMutating } from "@tanstack/react-query";

// The same key on every sign-in mutation (email login, signup, Google / GitHub)
// → React Query can tell us if ANY of them is running.
export const AUTH_MUTATION_KEY = ["auth"];

/**
 * true while a sign-in request is running (email login, signup or Google / GitHub).
 * The login + signup pages disable ALL their buttons with it,
 * so the user can't start a second sign-in in the middle of the first one.
 */
export const useIsAuthBusy = () => useIsMutating({ mutationKey: AUTH_MUTATION_KEY }) > 0;
