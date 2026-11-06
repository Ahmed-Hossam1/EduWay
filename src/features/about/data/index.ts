import { BarChart3, Compass, MessagesSquare, MonitorPlay, ShieldCheck, Target } from "lucide-react";
import { AboutFeature, AboutPath, AboutValue } from "../types";

// "Our mission" / "Our vision"
export const aboutValues: AboutValue[] = [
    {
        id: "mission",
        title: "Our mission",
        description:
            "Make good learning easy to reach: clear courses from real instructors, that you can watch on any internet speed and finish at your own pace.",
        icon: Target,
    },
    {
        id: "vision",
        title: "Our vision",
        description:
            "A place where every learner has a clear path from the first lesson to a real skill, and every expert can share what they know with the people who need it.",
        icon: Compass,
    },
];

// What makes EduWay different — only features the platform really has
export const aboutFeatures: AboutFeature[] = [
    {
        id: "streaming",
        title: "Smooth HD streaming",
        description:
            "Every lesson is streamed in many qualities (up to 1080p), so it plays well on slow and fast internet.",
        icon: MonitorPlay,
    },
    {
        id: "qa",
        title: "Ask the instructor",
        description: "Each lesson has its own Q&A. Instructors answer, and the best answer is marked for everyone.",
        icon: MessagesSquare,
    },
    {
        id: "progress",
        title: "Track your progress",
        description: 'Lessons are marked as done while you watch, and "Continue" takes you to your next lesson.',
        icon: BarChart3,
    },
    {
        id: "reviews",
        title: "Honest reviews",
        description: "Only students who joined a course can rate it, so every rating comes from a real learner.",
        icon: ShieldCheck,
    },
];

// How it works: one path for students, one for instructors
export const aboutPaths: AboutPath[] = [
    {
        id: "students",
        title: "For students",
        steps: [
            { id: "find", title: "Find a course", description: "Search by category, level and price." },
            { id: "join", title: "Join it", description: "Free courses right away, paid ones with a secure payment." },
            { id: "learn", title: "Learn and ask", description: "Watch, ask questions, and track your progress." },
        ],
        cta: { label: "Browse courses", href: "/courses" },
    },
    {
        id: "instructors",
        title: "For instructors",
        steps: [
            { id: "apply", title: "Apply", description: "Tell us about your experience. We review every teacher." },
            {
                id: "build",
                title: "Build your course",
                description: "Add sections, lessons and videos in the course builder.",
            },
            {
                id: "publish",
                title: "Publish and teach",
                description: "Publish when ready, answer questions and grow.",
            },
        ],
        cta: { label: "Become an instructor", href: "/auth/signup" },
    },
];
