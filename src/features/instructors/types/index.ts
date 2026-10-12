import { InstructorStats } from "@/features/instructor-details/types";
import { instructorsSortValues } from "../schemas/instructorsQuerySchema";

// "students" | "rating" | "courses"
export type InstructorSort = (typeof instructorsSortValues)[number];

// One card on the /instructors page
export interface InstructorListItem {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  headline: string | null;
  skills: string[];
  stats: InstructorStats;
}

export interface GetInstructorsParams {
  q?: string;
  sort?: InstructorSort;
}

export interface InstructorSortOption {
  value: InstructorSort;
  label: string;
}
