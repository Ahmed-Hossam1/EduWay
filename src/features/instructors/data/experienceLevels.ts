// The teaching experience levels of an instructor, in ONE place.
// The values are the same as the Postgres enum instructor_experience.
// Used by the onboarding (schema + the picker cards) and the public instructor page.

export const experienceValues = ["beginner", "intermediate", "expert", "veteran"] as const;

// "beginner" | "intermediate" | "expert" | "veteran"
export type InstructorExperience = (typeof experienceValues)[number];

export interface ExperienceLevel {
    id: InstructorExperience;
    label: string; // short, on the onboarding card: "1 – 2 Years"
    profileLabel: string; // long, on the instructor page: "1–2 years of experience"
    description: string;
}

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
    {
        id: "beginner",
        label: "1 – 2 Years",
        profileLabel: "1–2 years of experience",
        description: "Early career instructor or mentoring experience",
    },
    {
        id: "intermediate",
        label: "3 – 5 Years",
        profileLabel: "3–5 years of experience",
        description: "Experienced educator or senior industry practitioner",
    },
    {
        id: "expert",
        label: "5 – 10 Years",
        profileLabel: "5–10 years of experience",
        description: "Extensive professional and instructional background",
    },
    {
        id: "veteran",
        label: "10+ Years",
        profileLabel: "10+ years of experience",
        description: "Master educator or senior industry veteran",
    },
];

// "expert" → "5–10 years of experience"
export function getExperienceProfileLabel(level: InstructorExperience): string {
    return EXPERIENCE_LEVELS.find((item) => item.id === level)?.profileLabel ?? "";
}
