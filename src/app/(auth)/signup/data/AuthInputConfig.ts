import { AuthInputConfig } from "../../shared/types/AuthInputs";
import { Lock, Mail, User } from "lucide-react";

export const signupInputs: AuthInputConfig[] = [
    {
        name: "firstName",
        id: "signup-firstname",
        type: "text",
        placeholder: "First name",
        icon: User,
        autoComplete: "given-name",
        halfWidth: true,
    },
    {
        name: "lastName",
        id: "signup-lastname",
        type: "text",
        placeholder: "Last name",
        icon: User,
        autoComplete: "family-name",
        halfWidth: true,
    },
    {
        name: "email",
        id: "signup-email",
        type: "email",
        placeholder: "Email address",
        icon: Mail,
        autoComplete: "email",
        halfWidth: false,
    },
    {
        name: "password",
        id: "signup-password",
        type: "password",
        placeholder: "Password",
        icon: Lock,
        autoComplete: "new-password",
        hasTogglePassword: true,
        halfWidth: false,
    },
    {
        name: "confirmPassword",
        id: "signup-confirm-password",
        type: "password",
        placeholder: "Confirm password",
        icon: Lock,
        autoComplete: "new-password",
        hasTogglePassword: true,
        halfWidth: false,
    },
];

