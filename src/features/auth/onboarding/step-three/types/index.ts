import { LucideIcon } from "lucide-react";

export interface SocialLinkFieldConfig {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  helperText?: string;
  icon?: LucideIcon;
  required?: boolean;
}
