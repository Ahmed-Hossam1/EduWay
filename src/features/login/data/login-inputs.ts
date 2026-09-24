import { Lock, Mail } from "lucide-react";
import { LoginSchemaType } from "../schema/loginSchema";
import { AuthInputConfig } from "@/app/(auth)/shared/types/AuthInputs";

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
