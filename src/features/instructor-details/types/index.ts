import { InstructorExperience } from "@/features/instructors/data/experienceLevels";

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
export interface Instructor {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    // null => the teacher has no profile yet, or is not approved (RLS hides it from visitors)
    profile: InstructorProfile | null;
}

// Computed from the teacher's published courses
export interface InstructorStats {
    coursesCount: number;
    studentsCount: number;
    averageRating: number;
    ratingsCount: number;
}
