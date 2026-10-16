import * as z from "zod";
import { passwordSchema } from "../../shared/schemas/passwordSchema";

// Used by the form AND by POST /api/auth/reset-password
export const resetPasswordSchema = z
    .object({
        password: passwordSchema, // same rules as signup
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
