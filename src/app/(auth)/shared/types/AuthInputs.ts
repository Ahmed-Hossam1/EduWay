import { LucideIcon } from "lucide-react";

export interface AuthInputConfig<T extends string = string> {
    name: T;
    type: "text" | "email" | "password";
    placeholder?: string;
    icon: LucideIcon;
    id?: string;
    autoComplete?: string;
    halfWidth?: boolean;
    hasTogglePassword?: boolean;
}

