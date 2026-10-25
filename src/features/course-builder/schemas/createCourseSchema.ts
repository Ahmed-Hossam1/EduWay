import { z } from "zod";

// The course title rule (the database checks 3 to 150 characters too)
export const courseTitleSchema = z
    .string()
    .trim()
    .min(3, "The title should be at least 3 characters long")
    .max(150, "The title should be at most 150 characters long");

// /teacher/courses/new → the form AND the API route use it
export const createCourseSchema = z.object({
    title: courseTitleSchema,
    categoryId: z.uuid("Choose a category"),
});

export type CreateCourseValues = z.infer<typeof createCourseSchema>;
