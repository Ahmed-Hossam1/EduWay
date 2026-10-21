import { BookCopy, ExternalLink, IdCard, LayoutDashboard, LucideIcon, SquarePlus, Star, Users, Wallet } from "lucide-react";

export type TeacherNavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
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
            { label: "My courses", href: "/teacher/courses", icon: BookCopy, },
            { label: "Create course", href: "/teacher/courses/new", icon: SquarePlus, },
            { label: "Students", href: "/teacher/students", icon: Users, },
            { label: "Earnings", href: "/teacher/earnings", icon: Wallet, },
            { label: "Reviews", href: "/teacher/reviews", icon: Star, },
        ],
    },
    {
        label: "Account",
        items: [
            { label: "Instructor profile", href: "/teacher/profile", icon: IdCard, },
            { label: "View site", href: "/", icon: ExternalLink },
        ],
    },
];
