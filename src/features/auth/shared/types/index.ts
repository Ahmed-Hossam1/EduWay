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

// One feature line on the login / signup hero (AuthHero)
export interface AuthHeroFeature {
    title: string;
    description: string;
    icon: LucideIcon;
}

// What login / signup / choose-role answer: where to go next
export interface AuthResponse {
    nextRoute: string;
}
