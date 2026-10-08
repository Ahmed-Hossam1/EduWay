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
