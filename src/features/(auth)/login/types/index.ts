import { LucideIcon } from "lucide-react";

export type LoginFeaturesType = {
    title: string;
    description: string;
    icon: LucideIcon;
}

export interface LoginResponse {
    nextRoute: string;
    success: boolean
}