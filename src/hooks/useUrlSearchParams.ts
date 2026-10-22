"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// value = null → remove the param from the URL
type ParamsChanges = Record<string, string | null>;

/**
 * One place to read / change the search params of the CURRENT page (works on any page:
 * /courses, /instructors, /categories, /teacher/courses, a future admin page...).
 *
 * ?category=web-dev,design&sort=rating
 *   getValue("sort")                 → "rating"
 *   getValues("category")            → ["web-dev", "design"]
 *   updateParams({ sort: "newest" }) → goes to ?category=web-dev,design&sort=newest (and back to page 1)
 *   updateParams({ category: null }) → removes category from the URL
 *   getHref({ page: "3" })           → "/courses?category=web-dev,design&sort=rating&page=3" (a link, no navigation)
 */
export function useUrlSearchParams() {
    const router = useRouter();
    const pathname = usePathname();
    const currentParams = useSearchParams(); // read-only → we copy it before changing anything

    const getValue = (key: string) => currentParams.get(key);

    // "web-dev,design" → ["web-dev", "design"]   |   missing or "" → []
    const getValues = (key: string) => currentParams.get(key)?.split(",").filter(Boolean) ?? [];

    // The URL of this page with some params changed (the others stay as they are)
    const getHref = (changes: ParamsChanges) => {
        const params = new URLSearchParams(currentParams.toString());

        Object.entries(changes).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });

        const query = params.toString();
        return query ? `${pathname}?${query}` : pathname; // no "?" at the end when there are no params
    };

    // Change the filters → go to the new URL
    // page: null → any filter change goes back to page 1
    const updateParams = (changes: ParamsChanges) => {
        router.push(getHref({ ...changes, page: null }), { scroll: false });
    };

    return { getValue, getValues, getHref, updateParams };
}
