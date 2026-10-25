import { LucideIcon } from "lucide-react";
import { Profile } from "@/features/profile/types";
import { CategoryRow } from "@/features/categories/types";
import {
    coursesDurationValues,
    coursesLevelValues,
    coursesPriceValues,
    coursesSortValues,
} from "../schemas/coursesQuerySchema";

// Database enums
export type CourseLevel = (typeof coursesLevelValues)[number]; // "beginner" | "intermediate" | "advanced"
export type CourseStatus = "draft" | "published" | "archived";
export type CourseBadge = "bestseller" | "new" | "popular";

/**
 * THE course type of the app = one row of the courses table (every column).
 * Every other course shape is built from it, never written again by hand:
 *   Pick<Course, "id" | "title" | ...>            → only the columns a place needs
 *   Pick<Course, ...> & { earnings: number }      → + what that place adds (joins, numbers...)
 * A new column in the database → add it HERE once.
 */
export interface Course {
    id: string;
    instructor_id: string;
    title: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    thumbnail_url: string | null;
    language: string;
    level: CourseLevel;
    price: number;
    currency: string;
    status: CourseStatus;
    badge: CourseBadge | null;
    published_at: string | null;
    duration_seconds: number;
    lessons_count: number;
    students_count: number;
    rating_avg: number;
    rating_count: number;
    created_at: string;
    updated_at: string;
    learning_outcomes: string[]; // "What you'll learn"
    requirements: string[]; // requirements as text
}

// One row of the sections table (a part of a course: "Getting started", "Hooks"...)
export interface Section {
    id: string;
    course_id: string;
    title: string;
    position: number; // 1, 2, 3... the order inside the course
    created_at: string;
    updated_at: string;
}

// One row of the lessons table (a lesson inside a section)
export interface Lesson {
    id: string;
    section_id: string;
    title: string;
    description: string | null;
    duration_seconds: number; // 0 until the lesson has a video
    position: number; // 1, 2, 3... the order inside the section
    is_preview: boolean; // true → everybody can watch it (a free preview)
    created_at: string;
    updated_at: string;
}

// The teacher of a course (on the cards and the course page)
export type CourseInstructor = Pick<Profile, "id" | "first_name" | "last_name" | "avatar_url">;

// What the course cards receive (lists: courses, cart, wishlist, home, instructor page...)
export type CourseCard = Pick<
    Course,
    | "id"
    | "title"
    | "slug"
    | "short_description"
    | "thumbnail_url"
    | "level"
    | "price"
    | "currency"
    | "badge"
    | "published_at"
    | "duration_seconds"
    | "lessons_count"
    | "students_count"
    | "rating_avg"
    | "rating_count"
> & {
    instructor: CourseInstructor;
    categories: CategoryRow[];
};

// Response of getCourses() (one page of courses + what the pagination needs)
export interface CoursesResponse {
    courses: CourseCard[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

// UI-only types (filters sidebar / toolbar)
export interface FilterOption {
    id: string;
    label: string;
    count?: number;
}

export interface FilterGroup {
    id: string;
    title: string;
    options: FilterOption[];
}

export interface SortOption {
    value: CourseSort;
    label: string;
}

export interface HeroStat {
    id: string;
    value: string;
    label: string;
    icon: LucideIcon;
    color: string;
}

export interface PopularTopic {
    label: string;
    slug: string;
}

// ---------------------------------------------------------------------
// Params the frontend sends to getCourses() (they come from the URL)
// example: /courses?q=react&category=web-dev&level=beginner&price=free&duration=0-3&rating=4&sort=rating&page=2
// ---------------------------------------------------------------------
// derived from the arrays in coursesQuerySchema → one list of values for the URL, the types and the UI options
export type CourseSort = (typeof coursesSortValues)[number]; // "popular" | "rating" | "newest" | "price-asc" | "price-desc"
export type CoursePriceFilter = (typeof coursesPriceValues)[number]; // "free" | "paid"
export type CourseDurationFilter = (typeof coursesDurationValues)[number]; // hours: "0-3" | "3-10" | "10-plus"

export interface GetCoursesParams {
    q?: string; // search in the course title
    category?: string[]; // category slugs → ["web-dev", "design"]
    level?: CourseLevel[]; // ["beginner", "advanced"]
    price?: CoursePriceFilter[]; // ["free"] / ["paid"] / both
    duration?: CourseDurationFilter[]; // ["0-3", "10-plus"]
    rating?: number; // minimum rating → 4 means "4 stars & up"
    sort?: CourseSort; // default: "popular"
    page?: number; // default: 1
    instructorId?: string; // only this teacher's courses (instructor page)
}
