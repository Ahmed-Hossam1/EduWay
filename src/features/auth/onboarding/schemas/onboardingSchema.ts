import * as z from "zod";

// Same values as the Postgres enum instructor_experience
export const experienceValues = ["beginner", "intermediate", "expert", "veteran"] as const;

const currentYear = new Date().getFullYear();


// Step 1 · About you
export const stepOneSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "First name should be at least 2 characters long")
        .max(25, "First name should be at most 25 characters long"),

    lastName: z
        .string()
        .trim()
        .min(2, "Last name should be at least 2 characters long")
        .max(25, "Last name should be at most 25 characters long"),

    headline: z
        .string()
        .trim()
        .min(5, "Professional title should be at least 5 characters long")
        .max(80, "Professional title should be at most 80 characters long"),

    bio: z
        .string()
        .trim()
        .min(30, "Bio should be at least 30 characters long")
        .max(1000, "Bio should be at most 1000 characters long"),
});


// Step 2 · Teaching information

// One certificate. year is text in the form ("2024") and can stay empty.
export const certificationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Certificate name is required")
        .max(100, "Certificate name should be at most 100 characters long"),

    issuer: z.string().trim().max(100, "Issuer should be at most 100 characters long"),

    year: z
        .string()
        .trim()
        .refine(
            (year) => year === "" || (/^\d{4}$/.test(year) && Number(year) >= 1950 && Number(year) <= currentYear),
            `Enter a year between 1950 and ${currentYear}`
        ),
});

export const stepTwoSchema = z.object({
    categoryId: z.uuid("Choose your main teaching category"),

    skills: z
        .array(z.string().trim().min(1).max(30, "A skill should be at most 30 characters long"))
        .min(1, "Add at least one skill"),

    experienceLevel: z.enum(experienceValues, { error: "Choose your teaching experience" }),

    university: z.string().trim().max(80, "University should be at most 80 characters long"),

    company: z.string().trim().max(80, "Company should be at most 80 characters long"),

    certifications: z.array(certificationSchema).max(10, "You can add up to 10 certificates"),

    teachingLanguages: z.array(z.string()).min(1, "Choose at least one language"),
});


// Step 3 · Profile & verification
export const stepThreeSchema = z.object({
    // the photo link (Cloudinary). Empty = no photo
    avatarUrl: z
        .string()
        .trim()
        .url("Enter a valid image link")
        .optional(),

    // required
    linkedinUrl: z
        .union([
            z.literal(""),
            z.string().url().refine((val) => val.includes("linkedin.com"), "Enter a valid LinkedIn link (https://linkedin.com/in/)"),
        ])
        .optional(),
    // optional: empty, or a correct link
    websiteUrl: z
        .union([
            z.literal(""),
            z.url("Enter a valid URL"),
        ])

        .optional(),

    githubUrl: z
        .union([
            z.literal(""),
            z.url().refine((val) => val.includes("github.com"), "Enter a valid GitHub link (https://github.com/...")
        ])

        .optional(),

    twitterUrl: z
        .union([
            z.literal(""),
            z.url().refine((value) => value?.includes("x.com"), "Enter an X link (https://x.com/...)"),
        ])
        .optional(),

    // the checkbox must be checked
    confirmed: z.boolean().refine((checked) => checked, "Please confirm that your information is accurate"),
});


// combine the all 3 schemas in one schema to be
// used by the form and by POST /api/onboarding
// (the server checks everything again, never trust the browser)
export const onboardingSchema = z.object({
    ...stepOneSchema.shape,
    ...stepTwoSchema.shape,
    ...stepThreeSchema.shape,
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

// The fields of every step => "Continue" checks only the fields of the current step
export const STEP_FIELDS = {
    1: Object.keys(stepOneSchema.shape),
    2: Object.keys(stepTwoSchema.shape),
    3: Object.keys(stepThreeSchema.shape),
} as Record<1 | 2 | 3, (keyof OnboardingFormValues)[]>;
