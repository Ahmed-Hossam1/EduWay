import { InstructorExperience } from "@/features/instructors/data/experienceLevels";
import { Profile } from "@/features/profile/types";

// instructor_certifications row
export interface InstructorCertification {
    id: string;
    name: string;
    issuer: string | null;
    year: number | null;
}

// instructor_profiles row (+ its certifications)
export interface InstructorProfile {
    headline: string | null;
    bio: string | null;
    experience_level: InstructorExperience | null;
    skills: string[];
    teaching_languages: string[];
    linkedin_url: string | null;
    website_url: string | null;
    github_url: string | null;
    twitter_url: string | null;
    certifications: InstructorCertification[];
}

// What the instructor page receives
export type Instructor = Pick<Profile, "id" | "first_name" | "last_name" | "avatar_url"> & {
    // null => the teacher has no profile yet, or is not approved (RLS hides it from visitors)
    profile: InstructorProfile | null;
};

// Computed from the teacher's published courses
export interface InstructorStats {
    coursesCount: number;
    studentsCount: number;
    averageRating: number;
    ratingsCount: number;
}
