import { BookCopy, ExternalLink, IdCard, LayoutDashboard, LucideIcon, SquarePlus, Star, Users, Wallet } from "lucide-react";

export type TeacherNavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
    soon?: boolean; // the page doesn't exist yet → shown faded, not clickable
};

export type TeacherNavGroup = {
    label: string;
    items: TeacherNavItem[];
};

// The links of the teacher sidebar (remove "soon" when the page is built)
export const teacherNav: TeacherNavGroup[] = [
    {
        label: "Teaching",
        items: [
            { label: "Overview", href: "/teacher/dashboard", icon: LayoutDashboard },
            { label: "My courses", href: "/teacher/courses", icon: BookCopy, soon: true },
            { label: "Create course", href: "/teacher/courses/new", icon: SquarePlus, soon: true },
            { label: "Students", href: "/teacher/students", icon: Users, soon: true },
            { label: "Earnings", href: "/teacher/earnings", icon: Wallet, soon: true },
            { label: "Reviews", href: "/teacher/reviews", icon: Star, soon: true },
        ],
    },
    {
        label: "Account",
        items: [
            { label: "Instructor profile", href: "/teacher/profile", icon: IdCard, soon: true },
            { label: "View site", href: "/", icon: ExternalLink },
        ],
    },
];
