import { describe, expect, it } from "vitest";
import {
    formatCurrencyAmount,
    formatIdr,
    formatShortDate,
    toLocalDateKey,
} from "./formatters";

describe("formatters", () => {
    it("formats IDR amounts rounded with Indonesian grouping", () => {
        expect(formatIdr(125499.6)).toBe("Rp 125.500");
        expect(formatIdr(0)).toBe("Rp 0");
    });

    it("formats multi-currency amounts accurately", () => {
        expect(formatCurrencyAmount(45000, "idr")).toBe("Rp 45.000");
        expect(formatCurrencyAmount(19.5, "usd")).toBe("USD 19.50");
        expect(formatCurrencyAmount(1200, "eur")).toBe("EUR 1,200.00");
    });

    it("handles empty or invalid date inputs safely", () => {
        expect(formatShortDate(null)).toBe("—");
        expect(formatShortDate(undefined)).toBe("—");
        expect(formatShortDate("invalid-date")).toBe("—");
        expect(formatShortDate("2026-11-27T10:00:00Z", "en-US")).toContain("2026");
    });

    it("produces zero-padded local YYYY-MM-DD date keys", () => {
        const localDate = new Date(2026, 2, 5); // March 5, 2026
        expect(toLocalDateKey(localDate)).toBe("2026-03-05");
    });
});
