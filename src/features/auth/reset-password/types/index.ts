import { LucideIcon } from "lucide-react";
import { Input } from "@/types";

// One input of the reset password form = the app Input + what this form adds
export type resetPasswordFormInputsType = Input<"password" | "confirmPassword"> & {
    icon: LucideIcon;
    fullWidth: boolean;
    autoComplete: string;
    errorText?: string;
};
