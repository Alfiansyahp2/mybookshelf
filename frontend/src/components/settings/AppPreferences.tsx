import { motion } from "framer-motion";
import {
    Settings as SettingsIcon,
    Sun,
    Moon,
    Palette,
    Bell,
    Mail,
    Database,
    Clock,
    Check,
    SwatchBook,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../store/useThemeStore";
import {
    DARK_PALETTES,
    LIGHT_PALETTES,
    getDarkPalette,
    getLightPalette,
} from "../../constants/appPalettes";

export interface AppSettingsState {
    theme: string;
    notifications: boolean;
    emailUpdates: boolean;
    autoSave: boolean;
    readingReminders: boolean;
}

interface AppPreferencesProps {
    settings: AppSettingsState;
    setSettings: (settings: AppSettingsState) => void;
}

export default function AppPreferences({
    settings,
    setSettings,
}: AppPreferencesProps) {
    const { t } = useTranslation();
    const {
        isDarkMode,
        lightPalette,
        darkPalette,
        setDarkMode,
        setLightPalette,
        setDarkPalette,
    } = useThemeStore();

    const activeLight = getLightPalette(lightPalette);
    const activeDark = getDarkPalette(darkPalette);

    const preferenceToggles = [
        {
            key: "theme" as const,
            title: t("settings.theme.title", "Tema"),
            description: t(
                "settings.theme.desc",
                "Pilih tampilan yang Anda inginkan",
            ),
            icon: Palette,
            value: isDarkMode,
        },
        {
            key: "notifications" as const,
            title: t("settings.notifications.title", "Notifikasi"),
            description: t(
                "settings.notifications.desc",
                "Enable push notifications",
            ),
            icon: Bell,
            value: settings.notifications,
        },
        {
            key: "emailUpdates" as const,
            title: t("settings.email.title", "Email Updates"),
            description: t(
                "settings.email.desc",
                "Receive weekly reading summaries",
            ),
            icon: Mail,
            value: settings.emailUpdates,
        },
        {
            key: "autoSave" as const,
            title: t("settings.autosave.title", "AutoSave"),
            description: t(
                "settings.autosave.desc",
                "Automatically save changes",
            ),
            icon: Database,
            value: settings.autoSave,
        },
        {
            key: "readingReminders" as const,
            title: t("settings.reminders.title", "Reading Reminders"),
            description: t(
                "settings.reminders.desc",
                "Get reminded to read daily",
            ),
            icon: Clock,
            value: settings.readingReminders,
        },
    ];

    const handleToggle = (key: (typeof preferenceToggles)[number]["key"]) => {
        if (key === "theme") {
            const nextDark = !isDarkMode;
            setDarkMode(nextDark);
            setSettings({
                ...settings,
                theme: nextDark ? "dark" : "light",
            });
            return;
        }
        setSettings({
            ...settings,
            [key]: !settings[key],
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
            {/* App Color Palettes (Scoped to Authenticated App Only) */}
            <div className="bg-surface/95 rounded-2xl p-6 border border-walnut/15 dark:border-walnut/30 shadow-sm backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                    <div>
                        <h2 className="text-xl font-serif font-semibold text-ink flex items-center gap-2">
                            <SwatchBook className="w-5 h-5 text-walnut dark:text-gold" />
                            {t(
                                "settings.palettes.title",
                                "Palet Warna Aplikasi",
                            )}
                        </h2>
                        <p className="text-xs sm:text-sm text-walnut/80 dark:text-cream/65 mt-1">
                            {t(
                                "settings.palettes.subtitle",
                                "Berlaku khusus di dalam aplikasi (tidak mengubah Landing Page).",
                            )}
                        </p>
                    </div>
                </div>

                {/* Light Mode Palettes */}
                <div className="mb-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                            <Sun className="w-4 h-4 text-gold" />
                            <span>
                                {t(
                                    "settings.palettes.light_heading",
                                    "Palet Light Mode",
                                )}
                            </span>
                        </div>
                        {!isDarkMode && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-walnut/15 text-walnut">
                                {t("settings.palettes.active_mode", "Mode Aktif")}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {LIGHT_PALETTES.map((palette) => {
                            const isSelected = lightPalette === palette.id;
                            return (
                                <button
                                    key={palette.id}
                                    type="button"
                                    onClick={() => {
                                        setLightPalette(palette.id);
                                        setDarkMode(false);
                                    }}
                                    className={`text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                                        isSelected
                                            ? "border-walnut bg-beige/40 dark:bg-walnut/20 ring-2 ring-walnut/25 shadow-xs"
                                            : "border-walnut/15 dark:border-walnut/25 bg-surfaceAlt/80 hover:border-walnut/40"
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            {palette.swatches.map(
                                                (color, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="w-5 h-5 rounded-full border border-black/10 shadow-2xs shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                color,
                                                        }}
                                                    />
                                                ),
                                            )}
                                        </div>
                                        <p className="text-sm font-semibold text-ink truncate">
                                            {t(
                                                palette.nameKey,
                                                palette.defaultName,
                                            )}
                                        </p>
                                        <p className="text-[11px] text-walnut/75 dark:text-cream/60 truncate">
                                            {t(
                                                palette.descKey,
                                                palette.defaultDesc,
                                            )}
                                        </p>
                                    </div>
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                                            isSelected
                                                ? "bg-walnut border-walnut text-white"
                                                : "border-walnut/25 text-transparent"
                                        }`}
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Dark Mode Palettes */}
                <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                            <Moon className="w-4 h-4 text-walnut dark:text-gold" />
                            <span>
                                {t(
                                    "settings.palettes.dark_heading",
                                    "Palet Dark Mode",
                                )}
                            </span>
                        </div>
                        {isDarkMode && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gold/20 text-gold">
                                {t("settings.palettes.active_mode", "Mode Aktif")}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {DARK_PALETTES.map((palette) => {
                            const isSelected = darkPalette === palette.id;
                            return (
                                <button
                                    key={palette.id}
                                    type="button"
                                    onClick={() => {
                                        setDarkPalette(palette.id);
                                        setDarkMode(true);
                                    }}
                                    className={`text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                                        isSelected
                                            ? "border-walnut dark:border-gold bg-beige/40 dark:bg-walnut/20 ring-2 ring-walnut/25 dark:ring-gold/25 shadow-xs"
                                            : "border-walnut/15 dark:border-walnut/25 bg-surfaceAlt/80 hover:border-walnut/40"
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            {palette.swatches.map(
                                                (color, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="w-5 h-5 rounded-full border border-white/15 shadow-2xs shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                color,
                                                        }}
                                                    />
                                                ),
                                            )}
                                        </div>
                                        <p className="text-sm font-semibold text-ink truncate">
                                            {t(
                                                palette.nameKey,
                                                palette.defaultName,
                                            )}
                                        </p>
                                        <p className="text-[11px] text-walnut/75 dark:text-cream/60 truncate">
                                            {t(
                                                palette.descKey,
                                                palette.defaultDesc,
                                            )}
                                        </p>
                                    </div>
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                                            isSelected
                                                ? "bg-walnut dark:bg-gold border-walnut dark:border-gold text-white dark:text-darkBrown"
                                                : "border-walnut/25 text-transparent"
                                        }`}
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* General Preferences */}
            <div className="bg-surface/95 rounded-2xl p-6 border border-walnut/15 dark:border-walnut/30 shadow-sm backdrop-blur-sm">
                <h2 className="text-xl font-serif font-semibold text-ink mb-6 flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-walnut dark:text-gold" />
                    {t("settings.sections.preferences", "App Preferences")}
                </h2>
                <div className="space-y-3">
                    {preferenceToggles.map((item) => (
                        <div
                            key={item.key}
                            className="flex items-center justify-between p-4 bg-surfaceAlt/80 rounded-xl border border-walnut/10 dark:border-walnut/20 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        item.value
                                            ? "bg-walnut text-white"
                                            : "bg-walnut/15 dark:bg-walnut/25 text-walnut dark:text-gold"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-ink">
                                        {item.title}
                                    </p>
                                    <p className="text-sm text-walnut/75 dark:text-cream/60">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                aria-pressed={item.value}
                                onClick={() => handleToggle(item.key)}
                                className={`w-14 h-8 rounded-full transition-all duration-300 ${
                                    item.value
                                        ? "bg-walnut"
                                        : "bg-walnut/30 dark:bg-walnut/40"
                                } relative shrink-0`}
                            >
                                <div
                                    className={`w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${
                                        item.value
                                            ? "translate-x-7"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Live Theme & Palette Preview */}
            <div className="bg-surface/95 rounded-2xl p-6 border border-walnut/15 dark:border-walnut/30 shadow-sm backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-ink mb-4">
                    {t("settings.theme_preview", "Theme Preview")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setDarkMode(false)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                            !isDarkMode
                                ? "border-walnut ring-2 ring-walnut/25"
                                : "border-walnut/20 opacity-85 hover:opacity-100"
                        }`}
                        style={{
                            background: activeLight.cssVars["--app-wall-bg"],
                        }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <Sun
                                className="w-5 h-5"
                                style={{
                                    color: activeLight.swatches[2],
                                }}
                            />
                            <span
                                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: activeLight.swatches[1],
                                    color: activeLight.swatches[2],
                                }}
                            >
                                {t(activeLight.nameKey, activeLight.defaultName)}
                            </span>
                        </div>
                        <div
                            className="p-2.5 rounded-lg border border-black/10"
                            style={{
                                backgroundColor: activeLight.swatches[1],
                            }}
                        >
                            <p
                                className="text-xs font-semibold"
                                style={{
                                    color: `rgb(${activeLight.cssVars["--app-ink-rgb"]})`,
                                }}
                            >
                                {t("settings.light_mode", "Light Mode")}
                            </p>
                            <div
                                className="h-1.5 w-2/3 rounded-full mt-1.5"
                                style={{
                                    backgroundColor: activeLight.swatches[3],
                                }}
                            />
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setDarkMode(true)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                            isDarkMode
                                ? "border-gold ring-2 ring-gold/25"
                                : "border-walnut/20 opacity-85 hover:opacity-100"
                        }`}
                        style={{
                            background: activeDark.cssVars["--app-wall-bg"],
                        }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <Moon
                                className="w-5 h-5"
                                style={{
                                    color: activeDark.swatches[3],
                                }}
                            />
                            <span
                                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: activeDark.swatches[1],
                                    color: activeDark.swatches[3],
                                }}
                            >
                                {t(activeDark.nameKey, activeDark.defaultName)}
                            </span>
                        </div>
                        <div
                            className="p-2.5 rounded-lg border border-white/10"
                            style={{
                                backgroundColor: activeDark.swatches[1],
                            }}
                        >
                            <p
                                className="text-xs font-semibold"
                                style={{
                                    color: `rgb(${activeDark.cssVars["--app-ink-rgb"]})`,
                                }}
                            >
                                {t("settings.dark_mode", "Dark Mode")}
                            </p>
                            <div
                                className="h-1.5 w-2/3 rounded-full mt-1.5"
                                style={{
                                    backgroundColor: activeDark.swatches[3],
                                }}
                            />
                        </div>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
