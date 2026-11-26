import { create } from "zustand";
import {
    DARK_PALETTES,
    LIGHT_PALETTES,
    type DarkPaletteId,
    type LightPaletteId,
} from "../constants/appPalettes";

interface ThemeState {
    isDarkMode: boolean;
    lightPalette: LightPaletteId;
    darkPalette: DarkPaletteId;
    toggleDarkMode: () => void;
    setDarkMode: (val: boolean) => void;
    setLightPalette: (id: LightPaletteId) => void;
    setDarkPalette: (id: DarkPaletteId) => void;
}

const getInitialTheme = (): boolean => {
    if (typeof window === "undefined") return false;
    try {
        return localStorage.getItem("theme") === "dark";
    } catch {
        return false;
    }
};

const getInitialLightPalette = (): LightPaletteId => {
    if (typeof window === "undefined") return "parchment";
    try {
        const stored = localStorage.getItem("app_light_palette");
        if (LIGHT_PALETTES.some((p) => p.id === stored)) {
            return stored as LightPaletteId;
        }
    } catch {}
    return "parchment";
};

const getInitialDarkPalette = (): DarkPaletteId => {
    if (typeof window === "undefined") return "espresso";
    try {
        const stored = localStorage.getItem("app_dark_palette");
        if (DARK_PALETTES.some((p) => p.id === stored)) {
            return stored as DarkPaletteId;
        }
    } catch {}
    return "espresso";
};

const syncDomThemeClass = (isDark: boolean) => {
    if (typeof document === "undefined") return;
    if (isDark) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
    }
};

export const useThemeStore = create<ThemeState>((set) => {
    const initialDark = getInitialTheme();
    syncDomThemeClass(initialDark);

    return {
        isDarkMode: initialDark,
        lightPalette: getInitialLightPalette(),
        darkPalette: getInitialDarkPalette(),
        toggleDarkMode: () =>
            set((state) => {
                const next = !state.isDarkMode;
                try {
                    localStorage.setItem("theme", next ? "dark" : "light");
                } catch {}
                syncDomThemeClass(next);
                return { isDarkMode: next };
            }),
        setDarkMode: (val: boolean) => {
            try {
                localStorage.setItem("theme", val ? "dark" : "light");
            } catch {}
            syncDomThemeClass(val);
            set({ isDarkMode: val });
        },
        setLightPalette: (id: LightPaletteId) => {
            try {
                localStorage.setItem("app_light_palette", id);
            } catch {}
            set({ lightPalette: id });
        },
        setDarkPalette: (id: DarkPaletteId) => {
            try {
                localStorage.setItem("app_dark_palette", id);
            } catch {}
            set({ darkPalette: id });
        },
    };
});
