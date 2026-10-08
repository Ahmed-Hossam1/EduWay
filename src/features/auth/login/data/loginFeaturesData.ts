import { BarChart3, GraduationCap, Users } from "lucide-react";
import { LoginFeaturesType } from "../types";

export const loginFeaturesData: LoginFeaturesType[] = [
    {
        title: "Learn Anytime",
        description: "Access courses at your own pace.",
        icon: GraduationCap,
    },
    {
        title: "Track Progress",
        description: "Stay motivated with clear goals.",
        icon: BarChart3,
    },
    {
        title: "Join a Community",
        description: "Learn together, grow together.",
        icon: Users,
    },
];