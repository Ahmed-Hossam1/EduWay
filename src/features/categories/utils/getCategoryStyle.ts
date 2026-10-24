import { CategoryStyle, categoryStyles, defaultCategoryStyle } from "../data/categoryStyles";

// "web-dev" → its icon + color; an unknown slug → the default look
export function getCategoryStyle(slug: string): CategoryStyle {
    return categoryStyles[slug] ?? defaultCategoryStyle;
}
