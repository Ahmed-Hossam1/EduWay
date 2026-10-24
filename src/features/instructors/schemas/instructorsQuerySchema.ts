import { z } from "zod";

export const instructorsSortValues = ["students", "rating", "courses"] as const;

// no ?sort in the URL → this one (the schema, getInstructors and the sort select all use it)
export const DEFAULT_INSTRUCTORS_SORT = "students";

// Validates the search params of /instructors
// ?q=ahmed&sort=rating  =>  { q: "ahmed", sort: "rating" }
export const instructorsQuerySchema = z.object({
    q: z.string().trim().optional(),
    sort: z.enum(instructorsSortValues).default(DEFAULT_INSTRUCTORS_SORT),
});
