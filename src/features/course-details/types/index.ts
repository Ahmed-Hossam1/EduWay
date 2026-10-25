import { CourseInstructor, Course, Lesson, Section } from "@/features/courses/types";
import { CategoryRow } from "@/features/categories/types";
import { InstructorProfile } from "@/features/instructor-details/types";

// The course instructor + a small part of his instructor profile
// (profile is null when he has none, or is not approved yet)
export type CourseDetailsInstructor = CourseInstructor & {
    profile: Pick<InstructorProfile, "headline" | "bio"> | null;
};

// One lesson inside a section on the course page (no video yet → Phase 3)
export type CourseLesson = Pick<Lesson, "id" | "title" | "duration_seconds" | "position" | "is_preview">;

// One section of the curriculum with its lessons (sorted by position)
export type CourseSection = Pick<Section, "id" | "title" | "position"> & {
    lessons: CourseLesson[];
};

// A tag like "React" or "SQL"
export interface CourseTag {
    id: string;
    name: string;
    slug: string;
}

// A course you should finish first (course_requirements table)
export type PrerequisiteCourse = Pick<Course, "id" | "title" | "slug" | "thumbnail_url">;

// Everything the course details page needs
export type CourseDetails = Course & {
    instructor: CourseDetailsInstructor;
    categories: CategoryRow[];
    tags: CourseTag[];
    prerequisites: PrerequisiteCourse[];
    sections: CourseSection[];
};
