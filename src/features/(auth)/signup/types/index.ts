import { LucideIcon } from "lucide-react";

export type AuthRole = "student" | "teacher";


export interface RoleOption {
    id: AuthRole;
    label: string;
    subLabel: string;
    icon: LucideIcon
}


export interface SignupResponse {
    nextRoute: string;
    success: boolean
}