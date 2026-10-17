import { BarChart3, Briefcase, Code2, LucideIcon, Megaphone, Palette, Shapes } from "lucide-react";

export type CategoryStyle = {
    icon: LucideIcon;
    iconClass: string; // the colored square behind the icon
};

// The look of each category, by its slug (kept in the frontend, not in the database).
// A new category in the database works without changes here: it gets defaultCategoryStyle.
export const categoryStyles: Record<string, CategoryStyle> = {
    "web-dev": {
        icon: Code2,
        iconClass: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    },
    "data-ai": {
        icon: BarChart3,
        iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    },
    design: {
        icon: Palette,
        iconClass: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
    },
    marketing: {
        icon: Megaphone,
        iconClass: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    },
    business: {
        icon: Briefcase,
        iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    },
};

// For any slug that is not in the list above
export const defaultCategoryStyle: CategoryStyle = {
    icon: Shapes,
    iconClass: "bg-primary/10 text-primary",
};
