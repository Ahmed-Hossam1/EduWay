import { Lock } from "lucide-react";
import { resetPasswordFormInputsType } from "../types";


export const resetPasswordFormInputs: resetPasswordFormInputsType[] = [
    {
        id: "password",
        name: "password",
        type: "password",
        label: "New password",
        placeholder: "New password",
        icon: Lock,
        fullWidth: true,
        autoComplete: "new-password",
        errorText: "errors.password?.message",
    },
    {
        id: "confirmPassword",
        type: "password",
        name: "confirmPassword",
        label: "Confirm new password",
        placeholder: "Confirm new password",
        icon: Lock,
        fullWidth: true,
        autoComplete: "new-password",
        errorText: "errors.confirmPassword?.message",
    },
];