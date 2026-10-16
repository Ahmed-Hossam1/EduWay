import { LucideIcon } from "lucide-react";

export interface SocialLinkFieldConfig {
    id: string;
    name: "linkedinUrl" | "websiteUrl" | "githubUrl" | "twitterUrl"; // = the form fields
    label: string;
    placeholder: string;
    helperText?: string;
    icon?: LucideIcon;
    required?: boolean;
}
