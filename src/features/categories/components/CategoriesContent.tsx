import { use } from "react";
import { SearchX, Shapes } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { pluralize } from "@/lib/format";
import { CategoryListItem } from "../types";
import { CategoryCard } from "./CategoryCard";
import { PopularCategoryCard } from "./PopularCategoryCard";

type CategoriesContentProps = {
    categoriesPromise: Promise<CategoryListItem[]>;
    q: string; // the search text ("" = no search)
};

// The popular categories + all categories.
// It receives the promise (not the data) → use() waits for it,
export function CategoriesContent({ categoriesPromise, q }: CategoriesContentProps) {
    const categories = use(categoriesPromise);

    // Searched, but nothing matches
    if (q && categories.length === 0) {
        return (
            <Empty className="border border-dashed py-16">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <SearchX />
                    </EmptyMedia>
                    <EmptyTitle>No categories found</EmptyTitle>
                    <EmptyDescription>Nothing matches &quot;{q}&quot;. Try another word.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    // Searching → only the results (the "Popular" section is for browsing)
    if (q) {
        return (
            <section>
                <div className="mb-6 flex items-end justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-foreground">Search results</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Categories matching &quot;{q}&quot;</p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                        {categories.length} {pluralize(categories.length, "category", "categories")}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <CategoryCard key={category.slug} category={category} />
                    ))}
                </div>
            </section>
        );
    }

    if (categories.length === 0) {
        return (
            <Empty className="border border-dashed py-16">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Shapes />
                    </EmptyMedia>
                    <EmptyTitle>No categories yet</EmptyTitle>
                    <EmptyDescription>New courses are on the way. Check back soon.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    // The 3 categories with the most courses (copy first: sort() changes the array)
    const popularCategories = [...categories].sort((a, b) => b.coursesCount - a.coursesCount).slice(0, 3);

    return (
        <div className="space-y-14">
            {/* Popular */}
            <section>
                <div className="mb-6">
                    <h2 className="text-2xl font-black tracking-tight text-foreground">Popular categories</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Where most of our courses are</p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
                    {popularCategories.map((category, index) => (
                        <PopularCategoryCard key={category.slug} category={category} rank={index + 1} />
                    ))}
                </div>
            </section>

            {/* All (A to Z, the server already sorts them by name) */}
            <section>
                <div className="mb-6 flex items-end justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-foreground">All categories</h2>
                        <p className="mt-1 text-sm text-muted-foreground">From A to Z</p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                        {categories.length} {pluralize(categories.length, "category", "categories")}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <CategoryCard key={category.slug} category={category} />
                    ))}
                </div>
            </section>
        </div>
    );
}
