// Small display helpers shared by many features (text and numbers for the UI, no business logic)

/**
 * The full name of a person, or a fallback when both parts are empty.
 *   getFullName("Ahmed", "Hossam")            → "Ahmed Hossam"
 *   getFullName("Ahmed", null)                → "Ahmed"
 *   getFullName(null, null, "A student")      → "A student"
 */
export function getFullName(
    firstName: string | null | undefined,
    lastName: string | null | undefined,
    fallback = "",
): string {
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
    return fullName || fallback;
}

/**
 * Money with its currency symbol.
 *   formatMoney(24.99)            → "$24.99"  (the currency's normal decimals)
 *   formatMoney(4820, "USD", 0)   → "$4,820"  (no decimals: dashboard totals)
 *   formatMoney(10, "EUR")        → "€10.00"
 */
export function formatMoney(amount: number, currency = "USD", maxDecimals?: number): string {
    // no maxDecimals → Intl uses the currency's normal decimals (2 for USD)
    if (maxDecimals === undefined) {
        return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: maxDecimals,
    }).format(amount);
}

/**
 * The singular or plural form of a word for a count (the number itself is not included).
 *   pluralize(1, "course")                 → "course"
 *   pluralize(5, "course")                 → "courses"
 *   pluralize(2, "category", "categories") → "categories"
 */
export function pluralize(count: number, word: string, pluralWord = `${word}s`): string {
    return count === 1 ? word : pluralWord;
}
