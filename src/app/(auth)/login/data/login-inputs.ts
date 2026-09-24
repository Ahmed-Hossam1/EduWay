import { Lock, Mail } from "lucide-react";
import { AuthInputConfig } from "../../shared/types/AuthInputs";
import { LoginSchemaType } from "../../schema/loginSchema";

export const loginInputs: AuthInputConfig<keyof LoginSchemaType>[] = [
    {
        name: "email",
        id: "login-email",
        type: "email",
        placeholder: "Email address",
        icon: Mail,
        autoComplete: "email",
    },
    {
        name: "password",
        id: "login-password",
        type: "password",
        placeholder: "Password",
        icon: Lock,
        autoComplete: "off",
    },
];
