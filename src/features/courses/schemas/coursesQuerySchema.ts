import { z } from "zod";

export const COURSES_PAGE_SIZE = 9;

export const coursesSortValues = ["popular", "rating", "newest", "price-asc", "price-desc"] as const;
export const coursesLevelValues = ["beginner", "intermediate", "advanced"] as const;

// "web-dev,design" → ["web-dev", "design"]   |   "" or missing → undefined
const commaList = z
    .string()
    .optional()
    .transform((value) => (value ? value.split(",").map((v) => v.trim()).filter(Boolean) : undefined));

// Validates the search params of /courses and /api/courses
export const coursesQuerySchema = z.object({
    q: z.string().trim().optional(),
    category: commaList,
    // only real enum values reach the database (level=expert → 400)
    level: commaList.pipe(z.array(z.enum(coursesLevelValues)).optional()),
    sort: z.enum(coursesSortValues).default("popular"),
    page: z.coerce.number().int().min(1).default(1),
});

export type CoursesQuery = z.infer<typeof coursesQuerySchema>;
