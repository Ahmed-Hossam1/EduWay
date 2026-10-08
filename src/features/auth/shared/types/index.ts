import { LucideIcon } from "lucide-react";
import { UserRole } from "@/features/profile/types";

// Roles a user can pick by himself during signup (admin is assigned manually)
export type AuthRole = Exclude<UserRole, "admin">;

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
