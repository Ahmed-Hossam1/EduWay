import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CategoryListItem } from "../types";
import { pluralize } from "@/lib/format";
import { getCategoryStyle } from "../utils/getCategoryStyle";

type PopularCategoryCardProps = {
    category: CategoryListItem;
    rank: number; // 1, 2 or 3
};

// A big card for the top categories (the ones with the most courses)
export function PopularCategoryCard({ category, rank }: PopularCategoryCardProps) {
    const { icon: Icon, iconClass } = getCategoryStyle(category.slug);

    return (
        <Link
            href={`/courses?category=${category.slug}`}
            className="group flex flex-col rounded-3xl border border-border/80 bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:p-7"
        >
            {/* Icon + rank */}
            <div className="flex items-start justify-between">
                <div
                    className={cn(
                        "flex size-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-105",
                        iconClass,
                    )}
                >
                    <Icon className="size-7" />
                </div>

                {rank === 1 ? (
                    <Badge>
                        <Flame />
                        Most popular
                    </Badge>
                ) : (
                    <span className="text-sm font-black text-muted-foreground/60">#{rank}</span>
                )}
            </div>

            {/* Name + count */}
            <h3 className="mt-6 text-xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
                {category.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{category.coursesCount} {pluralize(category.coursesCount, "course")}</p>

            {/* Action */}
            <span className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-primary">
                Explore courses
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
        </Link>
    );
}
