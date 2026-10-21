import { daysAgo, startOfMonth } from "./dates";

// Something that happened on a date with a value (a sale: { date: paid_at, value: price })
export type DatedValue = {
    date: string;
    value: number;
};

/**
 * How many things happened on each of the last N days (oldest → newest).
 *   countPerDay(enrolledDates, 7) → [3, 0, 5, 2, 1, 4, 6]   (the last number = today)
 */
export function countPerDay(dates: string[], days: number): number[] {
    const counts: number[] = new Array(days).fill(0);
    const start = daysAgo(days);

    for (const date of dates) {
        const day = Math.floor((new Date(date).getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
        // only the last N days
        if (day >= 0 && day < days) counts[day] += 1;
    }

    return counts;
}

/**
 * The total of each week of the current month (week 1 = days 1-7, week 2 = days 8-14, ...).
 *   sumPerWeekOfMonth(sales) → [620, 1180, 840, 1460, 0]
 */
export function sumPerWeekOfMonth(items: DatedValue[]): number[] {
    const totals: number[] = [0, 0, 0, 0, 0]; // a month has 5 weeks at most
    const monthStart = startOfMonth();

    for (const item of items) {
        const date = new Date(item.date);
        if (date < monthStart) continue; // only this month

        const week = Math.floor((date.getDate() - 1) / 7); // day 1-7 → 0, 8-14 → 1, ...
        totals[week] += item.value;
    }

    return totals;
}

/**
 * The total of each of the last N months (oldest → newest), a month with nothing = 0.
 *   sumPerMonth(sales, 6) → [{ label: "May", value: 2100 }, ..., { label: "Oct", value: 4820 }]
 */
export function sumPerMonth(items: DatedValue[], months: number): { label: string; value: number }[] {
    const now = new Date();

    // the empty months first: "2026-05" → { label: "May", value: 0 }
    const result: { key: string; label: string; value: number }[] = [];
    for (let i = months - 1; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        result.push({
            key: `${month.getFullYear()}-${month.getMonth()}`,
            label: month.toLocaleDateString("en", { month: "short" }),
            value: 0,
        });
    }

    // then add every item to its month
    for (const item of items) {
        const date = new Date(item.date);
        const month = result.find((m) => m.key === `${date.getFullYear()}-${date.getMonth()}`);
        if (month) month.value += item.value;
    }

    return result.map(({ label, value }) => ({ label, value: Math.round(value * 100) / 100 }));
}
