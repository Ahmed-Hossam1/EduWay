import { Lock, Mail } from "lucide-react";
import { LoginSchemaType } from "../schemas/loginSchema";
import { AuthInputConfig } from "../../shared/types";

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
