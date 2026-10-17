import { CategoryRow, CourseInstructor, CourseRow } from "@/features/courses/types";
import { InstructorProfile } from "@/features/instructor-details/types";

// The course instructor + a small part of his instructor profile
// (profile is null when he has none, or is not approved yet)
export type CourseDetailsInstructor = CourseInstructor & {
    profile: Pick<InstructorProfile, "headline" | "bio"> | null;
};

// One lesson inside a section (no video yet → Phase 3)
export interface CourseLesson {
    id: string;
    title: string;
    duration_seconds: number;
    position: number;
    is_preview: boolean;
}

// One section of the curriculum with its lessons (sorted by position)
export interface CourseSection {
    id: string;
    title: string;
    position: number;
    lessons: CourseLesson[];
}

// A tag like "React" or "SQL"
export interface CourseTag {
    id: string;
    name: string;
    slug: string;
}

// A course you should finish first (course_requirements table)
export interface PrerequisiteCourse {
    id: string;
    title: string;
    slug: string;
    thumbnail_url: string | null;
}

// Everything the course details page needs
export type CourseDetails = CourseRow & {
    learning_outcomes: string[]; // "What you'll learn"
    requirements: string[]; // requirements as text
    instructor: CourseDetailsInstructor;
    categories: CategoryRow[];
    tags: CourseTag[];
    prerequisites: PrerequisiteCourse[];
    sections: CourseSection[];
};
