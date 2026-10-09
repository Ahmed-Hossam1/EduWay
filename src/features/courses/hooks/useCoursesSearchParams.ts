"use client"
import { useQueryParams } from "@/hooks/useQueryParams"
import { usePathname, useRouter } from "next/navigation"

/**
 * One place to read / change the courses filters in the URL.
 * Used by the filters sidebar, the category chips, the sort select and the search.
 *
 * ?category=web-dev,design&sort=rating
 *   getValue("sort")       → "rating"
 *   getValues("category")  → ["web-dev", "design"]
 *   updateParams({ sort: "newest" })   → ?category=web-dev,design&sort=newest
 *   updateParams({ category: null })   → removes category from the URL
 */
export function useCoursesSearchParams() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useQueryParams()

    const getValue = (key: string) => searchParams.get(key)

    const getValues = (key: string) => searchParams.get(key)?.split(",") ?? []

    // value = null → remove the param
    const updateParams = (changes: Record<string, string | null>) => {
        Object.entries(changes).forEach(([key, value]) => {
            if (value) searchParams.set(key, value)
            else searchParams.delete(key)
        })

        searchParams.delete("page") // any filter change → back to page 1
        router.push(`${pathname}?${searchParams.toString()}`, { scroll: false })
    }

    return { getValue, getValues, updateParams }
}
