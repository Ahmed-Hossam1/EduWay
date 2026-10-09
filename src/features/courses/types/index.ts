import { LucideIcon } from "lucide-react";

// Database enums 
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "draft" | "published" | "archived";
export type CourseBadge = "bestseller" | "new" | "popular";

export interface CourseRow {
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
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
}

// What the courses list / CourseCard receives
export interface CourseInstructor {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export type Course = Pick<
  CourseRow,
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

// Response of getCourses() and /api/courses
export interface CoursesResponse {
  courses: Course[];
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
  value: string;
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
export type CourseSort = "popular" | "rating" | "newest" | "price-asc" | "price-desc";
export type CoursePriceFilter = "free" | "paid";
export type CourseDurationFilter = "0-3" | "3-10" | "10-plus"; // hours

export interface GetCoursesParams {
  q?: string;                          // search in the course title
  category?: string[];                 // category slugs → ["web-dev", "design"]
  level?: CourseLevel[];               // ["beginner", "advanced"]
  price?: CoursePriceFilter[];         // ["free"] / ["paid"] / both
  duration?: CourseDurationFilter[];   // ["0-3", "10-plus"]
  rating?: number;                     // minimum rating → 4 means "4 stars & up"
  sort?: CourseSort;                   // default: "popular"
  page?: number;                       // default: 1
}
