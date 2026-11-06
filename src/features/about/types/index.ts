import { LucideIcon } from "lucide-react";

// "Our mission" / "Our vision" cards
export interface AboutValue {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
}

// "What makes EduWay different": one real feature of the platform
export interface AboutFeature {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
}

// One step of "How it works" (for students / for instructors)
export interface AboutStep {
    id: string;
    title: string;
    description: string;
}

// One column of "How it works": who it is for + its steps + where its button goes
export interface AboutPath {
    id: "students" | "instructors";
    title: string;
    steps: AboutStep[];
    cta: { label: string; href: string };
}
