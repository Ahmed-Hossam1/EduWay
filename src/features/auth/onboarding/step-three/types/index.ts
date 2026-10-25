import { LucideIcon } from "lucide-react";
import { Input } from "@/types";

// One social link input of onboarding step 3 = the app Input + a help line
export type SocialLinkFieldConfig = Input<"linkedinUrl" | "websiteUrl" | "githubUrl" | "twitterUrl"> & {
    helperText?: string;
    icon?: LucideIcon;
    required?: boolean;
};
