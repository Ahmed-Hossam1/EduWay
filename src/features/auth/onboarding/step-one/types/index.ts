import { LucideIcon } from "lucide-react";

export interface StepOneInputField {
  id: string;
  name: "firstName" | "lastName";
  type: string;
  label: string;
  placeholder?: string;
  icon?: LucideIcon;
  helperText?: string;
  required?: boolean;
}
