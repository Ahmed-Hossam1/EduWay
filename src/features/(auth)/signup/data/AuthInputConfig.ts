import { Lock, Mail, User } from "lucide-react";
import { signupSchemaType } from "../schema/schema";
import { AuthInputConfig } from "../../shared/types/AuthInputs";

export const signupInputs: AuthInputConfig<keyof signupSchemaType>[] = [
    {
        name: "firstName",
        id: "signup-firstname",
        type: "text",
        placeholder: "First name",
        icon: User,
        halfWidth: true,
    },
    {
        name: "lastName",
        id: "signup-lastname",
        type: "text",
        placeholder: "Last name",
        icon: User,
        halfWidth: true,
    },
    {
        name: "email",
        id: "signup-email",
        type: "email",
        placeholder: "Email address",
        icon: Mail,
        halfWidth: false,
    },
    {
        name: "password",
        id: "signup-password",
        type: "password",
        placeholder: "Password",
        icon: Lock,
        halfWidth: false,
    },
    {
        name: "confirmPassword",
        id: "signup-confirm-password",
        type: "password",
        placeholder: "Confirm password",
        icon: Lock,
        halfWidth: false,
    },
];

