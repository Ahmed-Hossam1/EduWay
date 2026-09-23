import { LucideIcon } from "lucide-react";

export interface AuthInputConfig {
    name: string;
    type: "text" | "email" | "password";
    placeholder?: string;
    icon: LucideIcon;
    id?: string;
    autoComplete?: string;
    halfWidth?: boolean;
    hasTogglePassword?: boolean;
}

