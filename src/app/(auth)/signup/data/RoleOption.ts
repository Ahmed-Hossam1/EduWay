import { GraduationCap, School } from "lucide-react";
import { RoleOption } from "../types";

export const roles: RoleOption[] = [
    {
        id: "student",
        label: "Student",
        subLabel: "I want to learn",
        icon: GraduationCap,
    },
    {
        id: "teacher",
        label: "Teacher",
        subLabel: "I want to teach",
        icon: School,
    },
];