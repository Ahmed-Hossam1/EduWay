import { NavItem, FooterColumn } from "@/types/navigation";

export const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Instructors", href: "/instructors" },
    { label: "About", href: "/about" },
    { label: "contact", href: "/contact" },
    { label: "Pricing", href: "/pricing" },
];

// Navbar search → "Trending" list (the most popular course names)
// Static for now (UI only). Later: load the top courses from the database.
export const trendingSearches: string[] = [
    "HTML & CSS Crash Course",
    "JavaScript Fundamentals",
    "SQL for Data Analysis",
    "Complete Web Development Bootcamp",
    "Data Science with Python: Zero to Hero",
    "UX Research Basics",
];

export const footerColumns: FooterColumn[] = [
    {
        title: "Explore",
        links: [
            { label: "Courses", href: "/courses" },
            { label: "Instructors", href: "/instructors" },
            { label: "Pricing", href: "/pricing" },
            { label: "Students", href: "/students" },
            { label: "Blog", href: "/blog" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Press", href: "/press" },
            { label: "Contact", href: "/contact" },
            { label: "Partnerships", href: "/partnerships" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Help Center", href: "/help" },
            { label: "Community", href: "/community" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "FAQs", href: "/faqs" },
        ],
    },
];
