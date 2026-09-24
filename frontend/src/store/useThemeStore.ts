import { create } from "zustand";

interface ThemeState {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    setDarkMode: (val: boolean) => void;
}

const getInitialTheme = (): boolean => {
    if (typeof window === "undefined") return false;
    try {
        const stored = localStorage.getItem("theme");
        return stored === "dark";
    } catch {
        return false;
    }
};

export const useThemeStore = create<ThemeState>((set) => {
    const initialDark = getInitialTheme();

    if (typeof document !== "undefined") {
        if (initialDark) {
            document.documentElement.classList.add("dark");
            document.body.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.body.classList.remove("dark");
        }
    }

    return {
        isDarkMode: initialDark,
        toggleDarkMode: () =>
            set((state) => {
                const next = !state.isDarkMode;
                try {
                    localStorage.setItem("theme", next ? "dark" : "light");
                } catch {}

                if (typeof document !== "undefined") {
                    if (next) {
                        document.documentElement.classList.add("dark");
                        document.body.classList.add("dark");
                    } else {
                        document.documentElement.classList.remove("dark");
                        document.body.classList.remove("dark");
                    }
                }

                return { isDarkMode: next };
            }),
        setDarkMode: (val: boolean) => {
            try {
                localStorage.setItem("theme", val ? "dark" : "light");
            } catch {}

            if (typeof document !== "undefined") {
                if (val) {
                    document.documentElement.classList.add("dark");
                    document.body.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                    document.body.classList.remove("dark");
                }
            }

            set({ isDarkMode: val });
        }
    };
});
