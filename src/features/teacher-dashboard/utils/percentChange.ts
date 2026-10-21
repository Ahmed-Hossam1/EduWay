// How much "now" changed compared to "before", in %, with 1 decimal:
//   percentChange(52, 45) → 15.6    percentChange(40, 50) → -20    before = 0 → 0 (no dividing by zero)
export function percentChange(now: number, before: number): number {
    if (before === 0) return 0;
    return Math.round(((now - before) / before) * 1000) / 10;
}
