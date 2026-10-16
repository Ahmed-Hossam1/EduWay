import { ExperienceLevel } from "../types";

// The categories come from the database (categories table).
// This only adds a short description under each one, by its slug.
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    "web-dev": "Frontend, Backend & Fullstack frameworks",
    "data-ai": "Machine Learning, Python & Analytics",
    design: "UI/UX, Figma & Product Design",
    marketing: "SEO, Social Media & Content Marketing",
    business: "Management, Entrepreneurship & Productivity",
};

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
    {
        id: "beginner",
        label: "1 – 2 Years",
        description: "Early career instructor or mentoring experience",
    },
    {
        id: "intermediate",
        label: "3 – 5 Years",
        description: "Experienced educator or senior industry practitioner",
    },
    {
        id: "expert",
        label: "5 – 10 Years",
        description: "Extensive professional and instructional background",
    },
    {
        id: "veteran",
        label: "10+ Years",
        description: "Master educator or senior industry veteran",
    },
];

export const POPULAR_SKILLS: string[] = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "Node.js",
    "Tailwind CSS",
    "UI/UX Design",
    "Figma",
    "SQL & Databases",
    "Git & GitHub",
    "Docker",
    "Machine Learning",
    "REST APIs",
    "GraphQL",
];

export const TEACHING_LANGUAGES: string[] = ["English", "Arabic", "French", "Spanish", "German"];
