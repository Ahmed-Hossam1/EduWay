import { z } from "zod";

export const instructorsSortValues = ["students", "rating", "courses"] as const;

// Validates the search params of /instructors
// ?q=ahmed&sort=rating  =>  { q: "ahmed", sort: "rating" }
export const instructorsQuerySchema = z.object({
    q: z.string().trim().optional(),
    sort: z.enum(instructorsSortValues).default("students"),
});
