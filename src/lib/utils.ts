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

export function isSafeQuery(schema: z.ZodTypeAny, params: unknown): unknown {
    const parsed = schema.safeParse(params);
    const query = parsed.success ? parsed.data : schema.parse({});
    return query;
}