import * as z from "zod";

// Used by POST /api/auth/resend-confirmation (the email comes from the signup / login form)
export const resendConfirmationSchema = z.object({
    email: z.email({ error: "Enter a valid email address" }),
});

export type ResendConfirmationSchemaType = z.infer<typeof resendConfirmationSchema>;
