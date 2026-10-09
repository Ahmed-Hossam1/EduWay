"use client"
import { use } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FilterOption } from "../types"

type CoursesCategoryChipsProps = {
    categoryPromise: Promise<FilterOption[]>
}

export default function CoursesCategoryChips({ categoryPromise }: CoursesCategoryChipsProps) {
    const categories = use(categoryPromise)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // The category in the URL (?category=design) → that chip is active
    // No category in the URL → "All" is active
    const activeCategory = searchParams.get("category")

    // slug = null means "All"
    const handleChipClick = (slug: string | null) => {
        const params = new URLSearchParams(searchParams.toString())

        if (slug) params.set("category", slug)
        else params.delete("category")

        params.delete("page") // new filter → page 1
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const chipClass = (isActive: boolean) =>
        `shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${isActive
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
        }`

    return (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            <button type="button" onClick={() => handleChipClick(null)} className={chipClass(!activeCategory)}>
                All
            </button>

            {categories.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    onClick={() => handleChipClick(category.id)}
                    className={chipClass(activeCategory === category.id)}
                >
                    {category.label}
                </button>
            ))}
        </div>
    )
}

// Loading state: grey pills with the same size as the real chips
export function CoursesCategoryChipsSkeleton() {
    return (
        <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="h-8 w-28 shrink-0 animate-pulse rounded-full bg-foreground/10" />
            ))}
        </div>
    )
}
