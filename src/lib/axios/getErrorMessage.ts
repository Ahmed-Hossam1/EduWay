import axios from "axios";

// What our API routes send back when something fails: { message: "..." }
type ApiErrorBody = {
    message?: string;
};

/**
 * The message to show the user when a request fails.
 *
 *   catch (error) {
 *       toast.error(getErrorMessage(error, "Failed to login"))
 *   }
 *
 * 1- our API answered with { message } (400, 401, 409...) → that message
 * 2- axios error without a message (no internet, server down) → fallback
 * 3- not an axios error at all (a bug in our code) → a general message
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError<ApiErrorBody>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    return "Something went wrong. Please try again.";
};
