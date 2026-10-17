import { CategoryStyle, categoryStyles, defaultCategoryStyle } from "../data/categoryStyles";

// "web-dev" → its icon + color; an unknown slug → the default look
export function getCategoryStyle(slug: string): CategoryStyle {
    return categoryStyles[slug] ?? defaultCategoryStyle;
}

// 1 → "1 course", 5 → "5 courses"
export function formatCoursesCount(count: number): string {
    return count === 1 ? "1 course" : `${count} courses`;
}
