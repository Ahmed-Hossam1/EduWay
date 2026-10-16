import * as z from "zod";

// Used by the form AND by POST /api/auth/forgot-password
export const forgotPasswordSchema = z.object({
    email: z.email({
        pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
        error: "Enter a valid email address",
    }),
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
