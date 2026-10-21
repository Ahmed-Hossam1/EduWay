// "2026-10-22T10:00:00Z" → "5 minutes ago" / "yesterday" / "3 days ago"
const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function timeAgo(date: string): string {
    const seconds = Math.round((new Date(date).getTime() - Date.now()) / 1000); // negative = in the past

    const minutes = Math.round(seconds / 60);
    const hours = Math.round(seconds / 3600);
    const days = Math.round(seconds / 86400);

    if (Math.abs(seconds) < 60) return "just now";
    if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
    if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
    if (Math.abs(days) < 30) return formatter.format(days, "day");

    return new Date(date).toLocaleDateString("en", { day: "numeric", month: "short" });
}
