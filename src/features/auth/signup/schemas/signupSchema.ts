import * as z from "zod";
import { passwordSchema } from "../../shared/schemas/passwordSchema";
import { emailSchema } from "../../shared/schemas/emailSchema";

export const signupSchema = z
    .object({
        firstName: z
            .string()
            .min(3, "first name should be at least 3 characters long")
            .max(25, "first name should be at most 25 characters long"),

        lastName: z
            .string()
            .min(3, "last name should be at least 3 characters long")
            .max(25, "last name should be at most 25 characters long"),

        email: emailSchema,

        password: passwordSchema,

        confirmPassword: z.string().min(1, "Please confirm your password"),

        // refine: adds custom validation after the object passes the basic field validations.
        // It compares password and confirmPassword and attaches the error to confirmPassword.
    })
    .refine((val) => val.password === val.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type signupSchemaType = z.infer<typeof signupSchema>;
