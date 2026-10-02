import { Lock, Mail } from "lucide-react";
import { LoginSchemaType } from "../schema/loginSchema";
import { AuthInputConfig } from "../../shared/types/AuthInputs";

export const loginInputs: AuthInputConfig<keyof LoginSchemaType>[] = [
    {
        name: "email",
        id: "login-email",
        type: "email",
        placeholder: "Email address",
        icon: Mail,
    },
    {
        name: "password",
        id: "login-password",
        type: "password",
        placeholder: "Password",
        icon: Lock,
    },
];
