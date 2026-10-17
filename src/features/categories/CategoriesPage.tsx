import { Suspense } from "react";
import { CategoriesHero } from "./components/CategoriesHero";
import { CategoriesContent } from "./components/CategoriesContent";
import { CategoriesSkeleton } from "./components/CategoriesSkeleton";
import { CategoryListItem } from "./types";

type CategoriesPageProps = {
    categoriesPromise: Promise<CategoryListItem[]>;
    q: string; // the search text ("" = no search)
};

export function CategoriesPage({ categoriesPromise, q }: CategoriesPageProps) {
    return (
        <>
            {/* the hero shows right away (no data needed) */}
            <CategoriesHero />

            <section className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                {/* skeleton first, then the real cards when the data arrives
                    (key={q} => a new search shows the skeleton again) */}
                <Suspense key={q} fallback={<CategoriesSkeleton />}>
                    <CategoriesContent categoriesPromise={categoriesPromise} q={q} />
                </Suspense>
            </section>
        </>
    );
}
