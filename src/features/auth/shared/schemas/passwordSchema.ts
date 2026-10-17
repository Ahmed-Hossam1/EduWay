import * as z from "zod";

// The rules for a NEW password — used by signup AND reset password (same rules everywhere).
// (login doesn't use it: an existing password is checked by Supabase, not by these rules)
export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(18, "Password must be at most 18 characters long")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
        "Password must contain uppercase, lowercase, number, and special character",
    );
