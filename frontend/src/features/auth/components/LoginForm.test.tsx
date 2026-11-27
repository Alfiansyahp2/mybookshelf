import { useState, type FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test/testUtils";
import type { LoginCredentials } from "../api/auth.api";
import LoginForm from "./LoginForm";

function ControlledLoginHarness({
    onSubmit,
    isLoading = false,
}: {
    onSubmit: (credentials: LoginCredentials) => void;
    isLoading?: boolean;
}) {
    const [formData, setFormData] = useState<LoginCredentials>({
        email: "",
        password: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <LoginForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
        />
    );
}

describe("LoginForm", () => {
    it("updates email/password inputs, toggles password visibility, and submits credentials", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();

        renderWithProviders(<ControlledLoginHarness onSubmit={onSubmit} />);

        const emailInput = screen.getByPlaceholderText("your@email.com");
        const passwordInput = screen.getByPlaceholderText("••••••••");

        await user.type(emailInput, "reader@example.com");
        await user.type(passwordInput, "secret123");

        expect(passwordInput).toHaveAttribute("type", "password");
        const buttons = screen.getAllByRole("button");
        await user.click(buttons[0]);
        expect(passwordInput).toHaveAttribute("type", "text");

        const submitButton = buttons[1];
        await user.click(submitButton);

        expect(onSubmit).toHaveBeenCalledWith({
            email: "reader@example.com",
            password: "secret123",
        });
    });

    it("disables submit button when loading", () => {
        renderWithProviders(
            <ControlledLoginHarness onSubmit={vi.fn()} isLoading />,
        );

        const buttons = screen.getAllByRole("button");
        expect(buttons[1]).toBeDisabled();
    });
});
