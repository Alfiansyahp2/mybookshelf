import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/testUtils";
import { RouteErrorBoundary } from "./RouteErrorBoundary";

let shouldThrow = true;

function FlakyChild() {
    if (shouldThrow) {
        throw new Error("Simulated route crash");
    }
    return <div>Recovered Content</div>;
}

describe("RouteErrorBoundary", () => {
    it("renders fallback UI on error and recovers when retried", async () => {
        const consoleErrorSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        const user = userEvent.setup();

        shouldThrow = true;
        renderWithProviders(
            <RouteErrorBoundary>
                <FlakyChild />
            </RouteErrorBoundary>,
        );

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        expect(screen.getByText("Simulated route crash")).toBeInTheDocument();

        shouldThrow = false;
        await user.click(screen.getByRole("button", { name: "Try again" }));

        expect(screen.getByText("Recovered Content")).toBeInTheDocument();
        consoleErrorSpy.mockRestore();
    });
});
