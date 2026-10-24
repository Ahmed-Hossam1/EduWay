import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { InstructorsHero } from "./components/InstructorsHero";
import { InstructorsCount } from "./components/InstructorsCount";
import { UrlSortSelect } from "@/components/shared/UrlSortSelect";
import { instructorsSortOptions } from "./data";
import { DEFAULT_INSTRUCTORS_SORT } from "./schemas/instructorsQuerySchema";
import { InstructorsGrid } from "./components/InstructorsGrid";
import { InstructorsGridSkeleton } from "./components/InstructorsGridSkeleton";
import { InstructorListItem } from "./types";

type InstructorsPageProps = {
    instructorsPromise: Promise<InstructorListItem[]>;
    filtersKey: string; // changes when the search / sort change => shows the skeleton again
};

export function InstructorsPage({ instructorsPromise, filtersKey }: InstructorsPageProps) {
    return (
        <>
            <InstructorsHero />
            <section className="container mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                {/* Results count + sort */}
                <div className="flex items-center justify-between gap-3">
                    <Suspense key={`count-${filtersKey}`} fallback={<Skeleton className="h-4 w-32" />}>
                        <InstructorsCount instructorsPromise={instructorsPromise} />
                    </Suspense>

                    <div className="flex items-center gap-2">
                        <span className="hidden text-sm text-muted-foreground sm:inline">Sort by</span>
                        <UrlSortSelect
                            options={instructorsSortOptions}
                            defaultValue={DEFAULT_INSTRUCTORS_SORT}
                            label="Sort instructors"
                            className="h-9 min-w-40"
                        />
                    </div>
                </div>

                {/* Instructor cards: skeleton first, then the real cards when the data arrives */}
                <Suspense key={`grid-${filtersKey}`} fallback={<InstructorsGridSkeleton />}>
                    <InstructorsGrid instructorsPromise={instructorsPromise} />
                </Suspense>
            </section>
        </>
    );
}
