import { LucideIcon } from "lucide-react";

export type resetPasswordFormInputsType = {
    id: string,
    name: "password" | "confirmPassword",
    type: string
    label: string,
    placeholder: string,
    icon: LucideIcon,
    fullWidth: boolean,
    autoComplete: string,
    errorText?: string,
}