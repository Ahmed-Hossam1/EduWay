import * as z from "zod";
import { emailSchema } from "../../shared/schemas/emailSchema";

export const loginSchema = z.object({
    email: emailSchema,

    password: z.string().min(1, "Password is required"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
