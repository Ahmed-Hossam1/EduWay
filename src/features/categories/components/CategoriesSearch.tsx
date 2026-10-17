"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
// same URL helper as /courses and /instructors (it works with the current page path)
import { useCoursesSearchParams } from "@/features/courses/hooks/useCoursesSearchParams";

/**
 * Search the categories by name, while the user types.
 *
 *   the user types "des"  → search = "des" (the input shows it right away)
 *   500ms with no new letter → the URL becomes /categories?q=des
 *   the page reads q on the server → shows only the matching categories
 */
export function CategoriesSearch() {
    const { getValue, updateParams } = useCoursesSearchParams();

    // start with the text that is already in the URL (refresh / shared link keeps the search)
    const [search, setSearch] = useState<string>(getValue("q") ?? "");

    // Debounce: wait 500ms after the last letter, then update the URL (one request, not one per letter)
    useEffect(() => {
        const timer = setTimeout(() => {
            const text = search.trim();

            // the URL already has this text (first render, or only spaces were added) → nothing to do
            if (text === (getValue("q") ?? "")) return;

            updateParams({ q: text || null }); // empty → removes q from the URL
        }, 500);

        // a new letter before the 500ms → cancel the old timer
        // (this cleanup works here because it is returned from useEffect, not from an event handler)
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- run only when the text changes
    }, [search]);

    return (
        <div className="mt-7 max-w-xl">
            <Input
                type="search"
                variant="outline"
                rounded="lg"
                placeholder="Search categories"
                aria-label="Search categories"
                Size="lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="size-4" />}
            />
        </div>
    );
}
