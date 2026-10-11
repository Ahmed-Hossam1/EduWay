import { InstructorExperience } from "../types";

// enum value → what the user sees (same text as the onboarding "Experience" step)
export const EXPERIENCE_LABELS: Record<InstructorExperience, string> = {
    beginner: "1–2 years of experience",
    intermediate: "3–5 years of experience",
    expert: "5–10 years of experience",
    veteran: "10+ years of experience",
};
