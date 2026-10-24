"use client";
import { FormEvent, useState } from "react";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";

/**
 * A search box that writes ?q=... to the URL when the user presses "Search" (or Enter),
 * not on every letter (for the debounced version see components/shared/UrlSearchInput).
 * The other params (filters, sort) stay; the page goes back to 1.
 *
 *   const { query, setQuery, handleSearch } = useUrlSearchForm();
 *   <form onSubmit={handleSearch}>
 *       <Input value={query} onChange={(e) => setQuery(e.target.value)} />
 *   </form>
 */
export function useUrlSearchForm() {
    const { getValue, updateParams } = useUrlSearchParams();
    // starts with the q already in the URL (useState reads it once → give the form a key={q} to reset it)
    const [query, setQuery] = useState<string>(getValue("q") ?? "");

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // stop the browser from reloading the page

        // empty text → null → removes q from the URL (the other params stay)
        updateParams({ q: query.trim() || null });
    };

    return { query, setQuery, handleSearch };
}
