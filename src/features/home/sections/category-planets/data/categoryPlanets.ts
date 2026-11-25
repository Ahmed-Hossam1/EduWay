import { BarChart3, Brain, Code, Megaphone, Palette, Smartphone } from "lucide-react";
import { CategoryPlanet } from "../types";

// The 6 planets of the home page. slug = the real category slug (the /courses filter uses it).
// Planets on the same orbit start on opposite sides (startAngle) so they never touch.
export const categoryPlanets: CategoryPlanet[] = [
    {
        id: "web-dev",
        name: "Web Development",
        shortName: "Web dev",
        slug: "web-dev",
        description: "Build websites and web apps, from your first HTML page to full stack projects.",
        topics: ["HTML, CSS and JavaScript", "React and Next.js", "Back end and databases"],
        icon: Code,
        look: { shape: "ico", color: "#1D9E75", size: 0.32, orbit: 2.2, speed: 0.5, startAngle: 0 },
    },
    {
        id: "data-ai",
        name: "Data Science & AI",
        shortName: "Data & AI",
        slug: "data-ai",
        description: "Turn data into answers and learn how machine learning really works.",
        topics: ["Python for data", "SQL and analytics", "Machine learning basics"],
        icon: Brain,
        look: { shape: "octa", color: "#D4537E", size: 0.28, orbit: 3.1, speed: 0.36, startAngle: 1.1 },
    },
    {
        id: "design",
        name: "Design & Creative",
        shortName: "Design",
        slug: "design",
        description: "Design interfaces people love, and learn the rules behind good visuals.",
        topics: ["UI and UX design", "Figma from scratch", "Color and typography"],
        icon: Palette,
        look: { shape: "ringed", color: "#D85A30", size: 0.3, orbit: 3.1, speed: 0.36, startAngle: 1.1 + Math.PI },
    },
    {
        id: "mobile-dev",
        name: "Mobile Development",
        shortName: "Mobile",
        slug: "mobile-dev",
        description: "Make apps for Android and iOS, and ship them to the stores.",
        topics: ["React Native", "Flutter", "Publishing your app"],
        icon: Smartphone,
        look: { shape: "cube", color: "#378ADD", size: 0.26, orbit: 4.0, speed: 0.26, startAngle: 2.4 },
    },
    {
        id: "marketing",
        name: "Digital Marketing",
        shortName: "Marketing",
        slug: "marketing",
        description: "Get your product in front of the right people and grow it online.",
        topics: ["SEO", "Social media ads", "Email campaigns"],
        icon: Megaphone,
        look: { shape: "sphere", color: "#BA7517", size: 0.24, orbit: 4.0, speed: 0.26, startAngle: 2.4 + Math.PI },
    },
    {
        id: "business",
        name: "Business & Productivity",
        shortName: "Business",
        slug: "business",
        description: "Work smarter, manage your time, and learn the basics of running a business.",
        topics: ["Time management", "Excel for business", "Starting a side project"],
        icon: BarChart3,
        look: { shape: "knot", color: "#7F77DD", size: 0.25, orbit: 4.8, speed: 0.19, startAngle: 4 },
    },
];
