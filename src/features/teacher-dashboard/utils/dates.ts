// Date helpers for the Overview numbers

// The first day of the current month, at 00:00 (e.g. 2026-10-01)
export function startOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
}

// The date N days ago (daysAgo(7) = one week ago)
export function daysAgo(days: number): Date {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}
