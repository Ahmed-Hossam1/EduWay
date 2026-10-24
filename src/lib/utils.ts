import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// "2026-10-22T10:00:00Z" → "5 minutes ago" / "yesterday" / "3 days ago"
const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function timeAgo(date: string): string {
    const seconds = Math.round((new Date(date).getTime() - Date.now()) / 1000); // negative = in the past

    const minutes = Math.round(seconds / 60);
    const hours = Math.round(seconds / 3600);
    const days = Math.round(seconds / 86400);

    if (Math.abs(seconds) < 60) return "just now";
    if (Math.abs(minutes) < 60) return relativeTimeFormatter.format(minutes, "minute");
    if (Math.abs(hours) < 24) return relativeTimeFormatter.format(hours, "hour");
    if (Math.abs(days) < 30) return relativeTimeFormatter.format(days, "day");

    return new Date(date).toLocaleDateString("en", { day: "numeric", month: "short" });
}

/**
 * Reads the search params of a page with its zod schema.
 * A broken URL (?page=abc, ?sort=xyz) → the schema defaults instead of a crash.
 * The result keeps the schema's type (z.infer), so the page gets typed values.
 *
 *   const query = parseSearchParams(coursesQuerySchema, await searchParams);
 */
export function parseSearchParams<T extends z.ZodType>(schema: T, params: unknown): z.infer<T> {
    const parsed = schema.safeParse(params);
    return parsed.success ? parsed.data : schema.parse({});
}