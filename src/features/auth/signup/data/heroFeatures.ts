import { BarChart3, GraduationCap, Users } from "lucide-react";
import { AuthHeroFeature } from "../../shared/types";

export const heroFeatures: AuthHeroFeature[] = [
    {
        title: "Learn from Experts",
        description: "Access high-quality courses from industry professionals.",
        icon: GraduationCap,
    },
    {
        title: "Track Your Progress",
        description: "Stay motivated with clear goals and achievements.",
        icon: BarChart3,
    },
    {
        title: "Be Part of a Community",
        description: "Connect, collaborate, and grow together.",
        icon: Users,
    },
];
