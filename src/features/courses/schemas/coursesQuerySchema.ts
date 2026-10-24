import { z } from "zod";

export const COURSES_PAGE_SIZE = 9;

export const coursesSortValues = ["popular", "rating", "newest", "price-asc", "price-desc"] as const;
export const coursesLevelValues = ["beginner", "intermediate", "advanced"] as const;
export const coursesPriceValues = ["free", "paid"] as const;
export const coursesDurationValues = ["0-3", "3-10", "10-plus"] as const;

// no ?sort in the URL → this one (the schema, getCourses and the sort select all use it)
export const DEFAULT_COURSES_SORT = "popular";

// "web-dev,design" => ["web-dev", "design"]   |   "" or missing => undefined
const commaList = z
    .string()
    .optional()
    .transform((value) =>
        value
            ? value
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean)
            : undefined,
    );

// Validates the search params of the /courses page
// The result matches GetCoursesParams, so it can go straight into getCourses()
export const coursesQuerySchema = z.object({
    q: z.string().trim().optional(),
    category: commaList,
    // only allowed values pass (level=expert => 400)
    level: commaList.pipe(z.array(z.enum(coursesLevelValues)).optional()),
    price: commaList.pipe(z.array(z.enum(coursesPriceValues)).optional()),
    duration: commaList.pipe(z.array(z.enum(coursesDurationValues)).optional()),
    rating: z.coerce.number().min(0).max(5).optional(),
    sort: z.enum(coursesSortValues).default(DEFAULT_COURSES_SORT),
    page: z.coerce.number().int().min(1).default(1),
});

