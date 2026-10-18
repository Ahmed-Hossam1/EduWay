import axios from "axios";

// What POST /api/auth/login sends when the user didn't click the link in his email yet
type LoginErrorBody = {
    message?: string;
    code?: string; // "email_not_confirmed"
};

// Did the login fail only because the email is not confirmed yet?
export const isEmailNotConfirmed = (error: unknown): boolean => {
    if (!axios.isAxiosError<LoginErrorBody>(error)) return false;

    return error.response?.data?.code === "email_not_confirmed";
};
