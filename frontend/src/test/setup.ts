import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./msw/server";
import i18n from "../app/i18n";

beforeAll(async () => {
    await i18n.changeLanguage("en");
    server.listen({ onUnhandledRequest: "bypass" });
});

afterEach(() => {
    cleanup();
    server.resetHandlers();
    localStorage.clear();
});

afterAll(() => {
    server.close();
});
