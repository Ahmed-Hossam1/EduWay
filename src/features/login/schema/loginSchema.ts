import * as z from "zod";

export const loginSchema = z.object({
    email: z.email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i }),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(18, "Password must be at most 18 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
            "Password must contain uppercase, lowercase, number, and special character"
        ),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;