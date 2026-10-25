import { z } from "zod";
import { coursesLevelValues } from "@/features/courses/schemas/coursesQuerySchema";

import { courseTitleSchema } from "./createCourseSchema";
import { COURSE_LANGUAGES, MAX_LIST_ITEMS, MAX_PREREQUISITES, MAX_TAGS } from "../constants";

// One line of "what you'll learn" / "requirements" (an empty line is allowed: the database skips it)
const listItem = z.string().trim().max(160, "Keep each line under 160 characters");

/**
 * The Details tab → the form AND the API route use it.
 * Only the title + a category are required to SAVE: a draft can be saved half done.
 * What a course needs to be PUBLISHED is checked by the database (the checklist).
 */
export const courseDetailsSchema = z.object({
    title: courseTitleSchema,
    shortDescription: z.string().trim().max(200, "The short description should be at most 200 characters long"),
    description: z.string().trim().max(5000, "The description should be at most 5000 characters long"),
    thumbnailUrl: z.union([z.literal(""), z.url("Upload the image again")]),
    language: z.enum(COURSE_LANGUAGES, { error: "Choose a language" }),
    level: z.enum(coursesLevelValues, { error: "Choose a level" }),
    learningOutcomes: z.array(listItem).max(MAX_LIST_ITEMS, `Up to ${MAX_LIST_ITEMS} lines`),
    requirements: z.array(listItem).max(MAX_LIST_ITEMS, `Up to ${MAX_LIST_ITEMS} lines`),
    categoryIds: z
        .array(z.uuid())
        .min(1, "Choose at least one category"),
    tags: z
        .array(z.string().trim().min(1).max(30, "A tag should be at most 30 characters long"))
        .max(MAX_TAGS, `Up to ${MAX_TAGS} tags`),
    prerequisiteIds: z.array(z.uuid()).max(MAX_PREREQUISITES, `Choose up to ${MAX_PREREQUISITES} courses`),
});

export type CourseDetailsValues = z.infer<typeof courseDetailsSchema>;
