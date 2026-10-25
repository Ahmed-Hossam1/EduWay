import { z } from "zod";
import { COURSE_CURRENCIES, MAX_PRICE, MIN_PAID_PRICE } from "../constants";

// The Pricing tab → the form AND the API route use it. price 0 = a free course.
export const coursePricingSchema = z.object({
    price: z
        .number({ error: "Enter a price" })
        .min(0, "The price can't be negative")
        .max(MAX_PRICE, `The price should be at most $${MAX_PRICE}`)
        .refine((price) => price === 0 || price >= MIN_PAID_PRICE, `A paid course costs at least $${MIN_PAID_PRICE.toFixed(2)}`),
    currency: z.enum(COURSE_CURRENCIES),
});

export type CoursePricingValues = z.infer<typeof coursePricingSchema>;
