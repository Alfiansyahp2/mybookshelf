/**
 * Format an amount in Indonesian Rupiah.
 */
export function formatIdr(amount: number): string {
    return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
}

/**
 * Format a numeric value with its currency code.
 */
export function formatCurrencyAmount(amount: number, currency = "IDR"): string {
    if (currency.toUpperCase() === "IDR") {
        return formatIdr(amount);
    }

    return `${currency.toUpperCase()} ${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

/**
 * Format an ISO timestamp string into a concise localized short date.
 */
export function formatShortDate(
    isoString: string | undefined | null,
    locale = "id-ID",
): string {
    if (!isoString) return "—";
    const parsed = new Date(isoString);
    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/**
 * Return YYYY-MM-DD in local time for calendar comparisons.
 */
export function toLocalDateKey(date: Date = new Date()): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}
