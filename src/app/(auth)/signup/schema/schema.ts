import * as z from "zod";

export const signupSchema = z.object({
    firstName: z.string().min(3, "first name should be at least 3 characters long").max(25, "first name should be at most 25 characters long"),
    lastName: z.string().min(3, "last name should be at least 3 characters long").max(25, "last name should be at most 25 characters long"),
    email: z.email({ pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(18, "Password must be at most 18 characters long")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
            "Password must contain uppercase, lowercase, number, and special character"
        ),
    confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((val) => val.password === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type signupSchemaType = z.infer<typeof signupSchema>;
