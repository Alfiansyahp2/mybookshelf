import { beforeEach, describe, expect, it } from "vitest";
import { useThemeStore } from "./useThemeStore";

describe("useThemeStore", () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
        useThemeStore.setState({
            isDarkMode: false,
            lightPalette: "parchment",
            darkPalette: "espresso",
        });
    });

    it("toggles dark mode, syncs DOM classes, and persists to localStorage", () => {
        useThemeStore.getState().toggleDarkMode();

        expect(useThemeStore.getState().isDarkMode).toBe(true);
        expect(localStorage.getItem("theme")).toBe("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
        expect(document.body.classList.contains("dark")).toBe(true);

        useThemeStore.getState().setDarkMode(false);

        expect(useThemeStore.getState().isDarkMode).toBe(false);
        expect(localStorage.getItem("theme")).toBe("light");
        expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("updates and persists light and dark palette selections", () => {
        useThemeStore.getState().setLightPalette("sage");
        useThemeStore.getState().setDarkPalette("midnight");

        expect(useThemeStore.getState().lightPalette).toBe("sage");
        expect(useThemeStore.getState().darkPalette).toBe("midnight");
        expect(localStorage.getItem("app_light_palette")).toBe("sage");
        expect(localStorage.getItem("app_dark_palette")).toBe("midnight");
    });
});
