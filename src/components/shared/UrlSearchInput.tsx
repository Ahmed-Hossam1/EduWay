"use client";

import { ComponentProps, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";

type UrlSearchInputProps = {
    placeholder: string;
    Size?: ComponentProps<typeof Input>["Size"];
    className?: string;
};

/**
 * A search input that writes what the user types into the URL (?q=...), while he types.
 *
 *   the user types "des"  → search = "des" (the input shows it right away)
 *   500ms with no new letter → the URL becomes ?q=des (and goes back to page 1)
 *   the page reads q on the server → shows only the matching items
 *
 *   <UrlSearchInput placeholder="Search categories" Size="lg" />
 */
export function UrlSearchInput({ placeholder, Size = "md", className }: UrlSearchInputProps) {
    const { getValue, updateParams } = useUrlSearchParams();
    const [search, setSearch] = useState<string>(getValue("q") ?? "");

    // Debounce: wait 500ms after the last letter, then update the URL (one request, not one per letter)
    useEffect(() => {
        const timer = setTimeout(() => {
            const text = search.trim();
            if (text === (getValue("q") ?? "")) return;
            updateParams({ q: text || null }); // empty  removes q from the URL
        }, 500);

        // (this cleanup works here because it is returned from useEffect, not from an event handler)
        return () => clearTimeout(timer);
        // only "search" starts the timer: getValue / updateParams are new functions on every render,
        // adding them would restart the 500ms wait all the time
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <Input
            type="search"
            variant="outline"
            rounded="lg"
            placeholder={placeholder}
            aria-label={placeholder}
            Size={Size}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="size-4" />}
            className={className}
        />
    );
}
