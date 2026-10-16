import { experienceValues } from "../../schemas/onboardingSchema";

export interface ExperienceLevel {
    id: (typeof experienceValues)[number];
    label: string;
    description: string;
}
