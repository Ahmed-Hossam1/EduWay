import * as z from "zod";
import { emailSchema } from "../../shared/schemas/emailSchema";

// Used by POST /api/auth/resend-confirmation (the email comes from the signup / login form)
export const resendConfirmationSchema = z.object({
    email: emailSchema,
});

export type ResendConfirmationSchemaType = z.infer<typeof resendConfirmationSchema>;
