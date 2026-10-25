import { LucideIcon } from "lucide-react";
import { Input } from "@/types";

// One input of onboarding step 1 = the app Input + an icon and a help line
export type StepOneInputField = Input<"firstName" | "lastName"> & {
    icon?: LucideIcon;
    helperText?: string;
    required?: boolean;
};
