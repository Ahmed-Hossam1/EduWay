import { formatMoney, getFullName } from "@/lib/format";
import { CourseBadge, CourseInstructor } from "../types";
import { courseLevelOptions } from "../data";

// 14820 => "4h 7m"   |   2700 => "45m"
export const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.round((totalSeconds % 3600) / 60);
    if (hours === 0) return `${minutes}m`;
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
};

// The length of ONE video, like a video player:  6 => "0:06"   |   878 => "14:38"   |   3723 => "1:02:03"
export const formatVideoDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const twoDigits = (value: number) => String(value).padStart(2, "0"); // 6 => "06"

    if (hours > 0) return `${hours}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
    return `${minutes}:${twoDigits(seconds)}`;
};

// 12400 => "12.4K"   |   850 => "850"
export const formatCompactNumber = (value: number) =>
    new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);

// 49.99 + "USD" => "$49.99"   |   0 => "Free"
export const formatPrice = (price: number, currency: string) => (price === 0 ? "Free" : formatMoney(price, currency));

// { first_name: "Ahmed", last_name: "Emad" } => "Ahmed Emad"
export const getInstructorName = (instructor: Pick<CourseInstructor, "first_name" | "last_name">) =>
    getFullName(instructor.first_name, instructor.last_name, "EduWay Instructor");

// "beginner" => "Beginner" (the labels of courseLevelOptions: the filters use the same ones)
export const getCourseLevelLabel = (level: string) =>
    courseLevelOptions.find((option) => option.id === level)?.label ?? level;

// badge from the database => text + color of the <Badge>
export const COURSE_BADGES: Record<CourseBadge, { label: string; variant: "success" | "accent" | "default" }> = {
    bestseller: { label: "Best Seller", variant: "success" },
    new: { label: "New", variant: "accent" },
    popular: { label: "Popular", variant: "default" },
};
