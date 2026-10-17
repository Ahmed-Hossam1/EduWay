import { BadgeCheck, Briefcase, GraduationCap } from "lucide-react";
import { InstructorSortOption } from "../types";

export const instructorsSortOptions: InstructorSortOption[] = [
    { value: "students", label: "Most students" },
    { value: "rating", label: "Highest rated" },
    { value: "courses", label: "Most courses" },
];

// Why our instructors (under the search)
export const highlights = [
    { icon: BadgeCheck, label: "Reviewed by our team" },
    { icon: Briefcase, label: "Real industry experience" },
    { icon: GraduationCap, label: "Teach what they do daily" },
];

// What a teacher gets (inside the "Teach on EduWay" card)
export const teachPerks = [
    "Share your knowledge with thousands of students",
    "Build your courses with simple tools",
    "Get paid for every enrollment",
];
