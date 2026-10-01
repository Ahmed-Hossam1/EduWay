import { ExperienceLevel, SubjectCategory } from "../types";

export const SUBJECT_CATEGORIES: SubjectCategory[] = [
  {
    id: "web-dev",
    label: "Web Development",
    description: "Frontend, Backend & Fullstack frameworks",
  },
  {
    id: "data-ai",
    label: "Data Science & AI",
    description: "Machine Learning, Python & Analytics",
  },
  {
    id: "design",
    label: "Design & Creative",
    description: "UI/UX, Figma & Product Design",
  },
  {
    id: "mobile-dev",
    label: "Mobile Development",
    description: "React Native, Flutter, iOS & Android",
  },
  {
    id: "cloud-devops",
    label: "Cloud & DevOps",
    description: "AWS, Docker, Kubernetes & CI/CD",
  },
  {
    id: "business-mgmt",
    label: "Business & Management",
    description: "Product Management & Entrepreneurship",
  },
];

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

export const TEACHING_LANGUAGES: string[] = [
  "English",
  "Arabic",
  "French",
  "Spanish",
  "German",
];
