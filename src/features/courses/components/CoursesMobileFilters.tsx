"use client"
import { Suspense } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { FilterOption } from "../types"
import { CoursesFilters } from "./CoursesFilters"
import CoursesFiltersSkeleton from "./CoursesFiltersSkeleton"

type CoursesMobileFiltersProps = {
    categoriesPromise: Promise<FilterOption[]>
}

// Small screens: the sidebar is hidden, so the same filters open in a Sheet
export function CoursesMobileFilters({ categoriesPromise }: CoursesMobileFiltersProps) {
    return (
        <Sheet>
            <SheetTrigger
                render={
                    <Button variant="outline" size="sm" rounded="full" className="lg:hidden">
                        <SlidersHorizontal />
                        Filters
                    </Button>
                }
            />
            <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Filter courses</SheetTitle>
                    <SheetDescription>Choose what you want to learn.</SheetDescription>
                </SheetHeader>
                <div className="px-4 pb-6">
                    <Suspense fallback={<CoursesFiltersSkeleton />}>
                        <CoursesFilters categoriesPromise={categoriesPromise} />
                    </Suspense>
                </div>
            </SheetContent>
        </Sheet>
    )
}
