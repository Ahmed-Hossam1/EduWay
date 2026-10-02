import { LucideIcon } from "lucide-react";

export interface AuthInputConfig<T extends string = string> {
    name: T;
    type: string;
    placeholder?: string;
    icon: LucideIcon;
    id?: string;
    halfWidth?: boolean;
}


export interface AuthResponse {
    nextRoute: string;
    success: boolean
}