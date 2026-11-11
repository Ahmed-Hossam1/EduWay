import * as z from "zod";
import { experienceValues } from "@/features/instructors/data/experienceLevels";

const currentYear = new Date().getFullYear();

// One certification (year is text in the form – same shape as onboarding certificationSchema)
export const profileCertificationSchema = z.object({
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
            `Enter a year between 1950 and ${currentYear}`,
        ),
});

export const teacherProfileSchema = z.object({
    // Personal info (from stepOneSchema)
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
        .max(120, "Professional title should be at most 120 characters long"),

    bio: z
        .string()
        .trim()
        .min(30, "Bio should be at least 30 characters long")
        .max(2000, "Bio should be at most 2000 characters long"),

    // Avatar (from stepThreeSchema)
    avatarUrl: z.string().trim().min(1, "Please upload a profile photo").url("Please upload a profile photo"),

    // Teaching information (from stepTwoSchema)
    experienceLevel: z.enum(experienceValues, { error: "Choose your teaching experience" }),

    skills: z
        .array(z.string().trim().min(1).max(30, "A skill should be at most 30 characters long"))
        .min(1, "Add at least one skill"),

    teachingLanguages: z.array(z.string()).min(1, "Choose at least one language"),

    university: z.string().trim().max(80, "University should be at most 80 characters long").optional(),

    company: z.string().trim().max(80, "Company should be at most 80 characters long").optional(),

    certifications: z.array(profileCertificationSchema).max(10, "You can add up to 10 certificates"),

    // Social links (from stepThreeSchema, without `confirmed`)
    linkedinUrl: z
        .union([
            z.literal(""),
            z
                .string()
                .url()
                .refine(
                    (val) => val.includes("linkedin.com"),
                    "Enter a valid LinkedIn link (https://linkedin.com/in/)",
                ),
        ])
        .optional(),

    websiteUrl: z.union([z.literal(""), z.url("Enter a valid URL")]).optional(),

    githubUrl: z
        .union([
            z.literal(""),
            z.url().refine((val) => val.includes("github.com"), "Enter a valid GitHub link (https://github.com/...)"),
        ])
        .optional(),

    twitterUrl: z
        .union([
            z.literal(""),
            z.url().refine((value) => value?.includes("x.com"), "Enter an X link (https://x.com/...)"),
        ])
        .optional(),
});

export type TeacherProfileValues = z.infer<typeof teacherProfileSchema>;
