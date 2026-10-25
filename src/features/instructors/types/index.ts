import { InstructorProfile, InstructorStats } from "@/features/instructor-details/types";
import { Profile } from "@/features/profile/types";
import { instructorsSortValues } from "../schemas/instructorsQuerySchema";

// "students" | "rating" | "courses"
export type InstructorSort = (typeof instructorsSortValues)[number];

// One card on the /instructors page
export type InstructorListItem = Pick<Profile, "id" | "first_name" | "last_name" | "avatar_url"> &
    Pick<InstructorProfile, "headline" | "skills"> & {
        stats: InstructorStats;
    };

export interface GetInstructorsParams {
    q?: string;
    sort?: InstructorSort;
}

export interface InstructorSortOption {
    value: InstructorSort;
    label: string;
}
