import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../../test/msw/server";
import { renderWithProviders } from "../../../test/testUtils";
import ExpenseModal from "./ExpenseModal";

describe("ExpenseModal", () => {
    it("loads categories and submits a new expense via MSW API", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        let submittedBody: Record<string, unknown> | null = null;

        server.use(
            http.post(
                "http://localhost:8000/api/v1/accounting/expenses",
                async ({ request }) => {
                    submittedBody = (await request.json()) as Record<
                        string,
                        unknown
                    >;
                    return HttpResponse.json(
                        {
                            success: true,
                            data: { id: "exp-new-1", ...submittedBody },
                        },
                        { status: 201 },
                    );
                },
            ),
        );

        renderWithProviders(
            <ExpenseModal isOpen onClose={onClose} mode="create" />,
        );

        const titleInput = screen.getByPlaceholderText(/Great Gatsby/i);
        const amountInput = screen.getByPlaceholderText("0.00");

        await user.type(titleInput, "Clean Code Hardcover");
        await user.clear(amountInput);
        await user.type(amountInput, "320000");

        await user.click(
            screen.getByRole("button", { name: /Create Expense|Tambah Pengeluaran/i }),
        );

        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
        expect(submittedBody).toMatchObject({
            title: "Clean Code Hardcover",
            amount: 320000,
            currency: "IDR",
            payment_method: "cash",
        });
    });

    it("does not render when isOpen is false", () => {
        const { container } = renderWithProviders(
            <ExpenseModal isOpen={false} onClose={vi.fn()} />,
        );

        expect(container.firstChild).toBeNull();
    });
});
