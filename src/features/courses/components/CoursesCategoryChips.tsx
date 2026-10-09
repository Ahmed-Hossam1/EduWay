"use client"
import { use } from "react"
import { useCoursesSearchParams } from "../hooks/useCoursesSearchParams"
import { FilterOption } from "../types"
import { Button } from "@/components/ui/button"

type CoursesCategoryChipsProps = {
    categoryPromise: Promise<FilterOption[]>
}

export default function CoursesCategoryChips({ categoryPromise }: CoursesCategoryChipsProps) {
    const categories = use(categoryPromise)
    const { getValue, updateParams } = useCoursesSearchParams()

    // The category in the URL (?category=design) → that chip is active
    // No category in the URL → "All" is active
    const activeCategory = getValue("category")

    // slug = null means "All"
    const handleChipClick = (slug: string | null) => {
        updateParams({ category: slug })
    }

    return (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            <Button type="button" rounded="full" onClick={() => handleChipClick(null)} variant={!activeCategory ? "default" : "outline"}>
                All
            </Button>

            {categories.map((category) => (
                <Button key={category.id} type="button" rounded="lg" onClick={() => handleChipClick(category.id)} variant={activeCategory === category.id ? "default" : "outline"}>
                    {category.label}
                </Button>
            ))}
        </div>
    )
}

