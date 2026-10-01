import { GraduationCap, BookOpen } from "lucide-react";

export const rolesData = [
    {
        id: "role-student",
        role: "student" as const,
        title: "I'm a Student",
        description:
            "Access thousands of courses, learn at your own pace, and build skills that open new doors.",
        icon: <GraduationCap className="size-7 text-primary" aria-hidden="true" />,
        accentColor: "bg-accent",
        features: [
            "Browse & enroll in any course",
            "Track your learning progress",
            "Earn certificates on completion",
            "Ask questions & join discussions",
        ],
    },
    {
        id: "role-teacher",
        role: "teacher" as const,
        title: "I'm a Teacher",
        description:
            "Share your expertise, create engaging courses, and reach learners across the globe.",
        icon: <BookOpen className="size-7 text-primary" aria-hidden="true" />,
        accentColor: "bg-accent",
        features: [
            "Create & publish your own courses",
            "Manage students & track progress",
            "Earn revenue from enrollments",
            "Get featured on the platform",
        ],
    },
];
