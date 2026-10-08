import { CourseBadge, CourseInstructor } from "../types";

// 14820 → "4h 7m"   |   2700 → "45m"
export const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.round((totalSeconds % 3600) / 60);
    if (hours === 0) return `${minutes}m`;
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
};

// 12400 → "12.4K"   |   850 → "850"
export const formatCompactNumber = (value: number) =>
    new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);

// 49.99 + "USD" → "$49.99"   |   0 → "Free"
export const formatPrice = (price: number, currency: string) =>
    price === 0
        ? "Free"
        : new Intl.NumberFormat("en", { style: "currency", currency }).format(price);

// { first_name: "Ahmed", last_name: "Emad" } → "Ahmed Emad"
export const getInstructorName = (instructor: CourseInstructor) =>
    `${instructor.first_name ?? ""} ${instructor.last_name ?? ""}`.trim() || "EduWay Instructor";

// badge from the database → text + color of the <Badge>
export const COURSE_BADGES: Record<CourseBadge, { label: string; variant: "success" | "accent" | "default" }> = {
    bestseller: { label: "Best Seller", variant: "success" },
    new: { label: "New", variant: "accent" },
    popular: { label: "Popular", variant: "default" },
};
