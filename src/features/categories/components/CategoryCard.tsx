import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryListItem } from "../types";
import { pluralize } from "@/lib/format";
import { getCategoryStyle } from "../utils/getCategoryStyle";

type CategoryCardProps = {
    category: CategoryListItem;
};

// A small card in the "All categories" grid → opens /courses filtered by this category
export function CategoryCard({ category }: CategoryCardProps) {
    const { icon: Icon, iconClass } = getCategoryStyle(category.slug);

    return (
        <Link
            href={`/courses?category=${category.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-5"
        >
            {/* Icon */}
            <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", iconClass)}>
                <Icon className="size-6" />
            </div>

            {/* Name + count */}
            <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 leading-snug font-bold text-foreground transition-colors group-hover:text-primary">
                    {category.name}
                </h3>
                <p className="text-xs text-muted-foreground sm:text-sm">{category.coursesCount} {pluralize(category.coursesCount, "course")}</p>
            </div>

            {/* Arrow */}
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
        </Link>
    );
}
