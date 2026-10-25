import { z } from "zod";

// The title of a section or a lesson (the database checks 1 to 150 characters too)
const curriculumTitle = z
    .string()
    .trim()
    .min(1, "Write a title")
    .max(150, "The title should be at most 150 characters long");

// Add / rename a section, add a lesson → the inline title forms AND the API routes use it
export const titleSchema = z.object({
    title: curriculumTitle,
});

export type TitleValues = z.infer<typeof titleSchema>;

// The lesson dialog: title + description + free preview
export const lessonSchema = z.object({
    title: curriculumTitle,
    description: z.string().trim().max(2000, "The description should be at most 2000 characters long"),
    isPreview: z.boolean(),
});

export type LessonValues = z.infer<typeof lessonSchema>;

// The new order after a drag: all the ids of the list, in the new order
export const reorderSchema = z.object({
    ids: z.array(z.uuid()).min(1),
});

export type ReorderValues = z.infer<typeof reorderSchema>;
