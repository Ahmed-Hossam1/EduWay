import * as z from "zod";

// The rule for an email typed in a form — used by login, signup, forgot password and resend confirmation
// (the same check everywhere, and the API routes validate with the same schemas)
export const emailSchema = z.email({
    pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
    error: "Enter a valid email address",
});
