import { LucideIcon } from "lucide-react";
import { Input } from "@/types";
import { UserRole } from "@/features/profile/types";

// Roles a user can pick by himself during signup (admin is assigned manually)
export type AuthRole = Exclude<UserRole, "admin">;

// One input of the login / signup forms = the app Input + an icon (+ half width on signup)
export type AuthInputConfig<T extends string = string> = Input<T> & {
    icon: LucideIcon;
    halfWidth?: boolean;
};

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
