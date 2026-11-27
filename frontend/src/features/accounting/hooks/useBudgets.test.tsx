import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../../test/msw/server";
import { createQueryWrapper } from "../../../test/testUtils";
import { useBudgets } from "./useBudgets";

describe("useBudgets", () => {
    it("loads budget list from accounting API via MSW", async () => {
        server.use(
            http.get("http://localhost:8000/api/v1/accounting/budgets", () =>
                HttpResponse.json({
                    success: true,
                    data: {
                        data: [
                            {
                                id: "budget-1",
                                name: "Monthly Books",
                                amount: 500000,
                                currency: "IDR",
                                period: "monthly",
                                is_active: true,
                            },
                        ],
                        meta: { total: 1, per_page: 15, current_page: 1, last_page: 1 },
                    },
                }),
            ),
        );

        const { result } = renderHook(() => useBudgets(), {
            wrapper: createQueryWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.data?.data[0]?.name).toBe("Monthly Books");
    });
});
