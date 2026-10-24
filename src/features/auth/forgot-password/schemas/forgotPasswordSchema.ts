import * as z from "zod";
import { emailSchema } from "../../shared/schemas/emailSchema";

// Used by the form AND by POST /api/auth/forgot-password
export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
