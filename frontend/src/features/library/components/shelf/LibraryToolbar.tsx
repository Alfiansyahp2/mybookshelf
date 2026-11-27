import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Filter, Layers, LayoutGrid, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import BigDigitalClock from "@shared/components/ui/BigDigitalClock";
import FlipCalendar from "@shared/components/ui/FlipCalendar";
import LightingControl from "./LightingControl";

const LIBRARY_FILTER_TABS = [
    { key: "all", labelKey: "library.filters.all" },
    { key: "reading", labelKey: "library.filters.reading" },
    { key: "finished", labelKey: "library.filters.finished" },
    { key: "unread", labelKey: "library.filters.unread" },
    { key: "borrowed", labelKey: "library.filters.borrowed" },
] as const;

export type LibraryFilterCounts = Record<
    (typeof LIBRARY_FILTER_TABS)[number]["key"],
    number
>;

interface LibraryToolbarProps {
    viewMode: "shelf" | "grid";
    isEditMode: boolean;
    activeFilter: string;
    isFilterExpanded: boolean;
    counts: LibraryFilterCounts;
    onViewModeChange: (mode: "shelf" | "grid") => void;
    onEditModeChange: (edit: boolean) => void;
    onFilterToggle: () => void;
    onFilterSelect: (filterKey: string) => void;
    onOpenCalendar: () => void;
}

export default function LibraryToolbar({
    viewMode,
    isEditMode,
    activeFilter,
    isFilterExpanded,
    counts,
    onViewModeChange,
    onEditModeChange,
    onFilterToggle,
    onFilterSelect,
    onOpenCalendar,
}: LibraryToolbarProps) {
    const { t } = useTranslation();

    return (
        <div className="relative z-50 flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 mb-0 pt-0 px-1 md:px-0">
            {/* Left Side (Filters, View Switcher & Layout) */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar mb-1 md:mb-1.5">
                {/* View Mode Switcher (Shelf vs Grid) */}
                <div className="flex items-center bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/50 dark:border-white/10 p-0.5 sm:p-1 rounded-xl shadow-xs shrink-0">
                    <button
                        onClick={() => onViewModeChange("shelf")}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                            viewMode === "shelf"
                                ? "bg-white text-darkBrown shadow-xs"
                                : "text-walnut/70 hover:text-darkBrown"
                        }`}
                        title={t("library.view_shelf", "Tampilan Rak")}
                    >
                        <BookOpen size={14} />
                        <span className="hidden xs:inline">
                            {t("library.view_shelf_short", "Rak")}
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            onViewModeChange("grid");
                            onEditModeChange(false);
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                            viewMode === "grid"
                                ? "bg-white text-darkBrown shadow-xs"
                                : "text-walnut/70 hover:text-darkBrown"
                        }`}
                        title={t("library.view_grid", "Tampilan Grid Sampul")}
                    >
                        <LayoutGrid size={14} />
                        <span className="hidden xs:inline">
                            {t("library.view_grid_short", "Grid")}
                        </span>
                    </button>
                </div>

                {/* Edit Layout Button (Only available in Shelf view) */}
                {viewMode === "shelf" && (
                    <div className="flex gap-1.5 shrink-0">
                        {isEditMode ? (
                            <button
                                onClick={() => onEditModeChange(false)}
                                className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-xl bg-green-600/90 text-white backdrop-blur-sm border border-white/20 flex items-center gap-1.5 hover:bg-green-500 shadow-md transition-all"
                            >
                                <Save size={13} />
                                <span className="text-[11px] sm:text-xs font-semibold">
                                    {t("library.done")}
                                </span>
                            </button>
                        ) : (
                            <motion.button
                                onClick={() => onEditModeChange(true)}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/40 backdrop-blur-md border border-white/40 shadow-xs sm:shadow-sm flex items-center justify-center text-[#5a3410] transition-all hover:bg-white/60"
                                title={t("library.edit_layout")}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Layers size={14} />
                            </motion.button>
                        )}
                    </div>
                )}

                {/* Filter Tabs (Animated Expandable Sliding Pill) */}
                <motion.div
                    layout
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center bg-white/30 backdrop-blur-md border border-white/50 p-0.5 sm:p-1 rounded-xl shadow-[0_4px_16px_rgb(0,0,0,0.04)] shrink-0"
                >
                    <motion.button
                        layout
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        onClick={onFilterToggle}
                        className={`flex items-center justify-center h-6 sm:h-7 px-2 sm:px-2.5 rounded-lg shrink-0 ${
                            isFilterExpanded
                                ? "bg-white/40 text-darkBrown hover:bg-white/60"
                                : "bg-white text-darkBrown shadow-xs hover:bg-white/90"
                        }`}
                    >
                        <div className="w-3.5 h-3.5 relative flex items-center justify-center shrink-0">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={isFilterExpanded ? "close" : "open"}
                                    initial={{
                                        rotate: isFilterExpanded ? -90 : 90,
                                        opacity: 0,
                                        scale: 0.7,
                                    }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{
                                        rotate: isFilterExpanded ? 90 : -90,
                                        opacity: 0,
                                        scale: 0.7,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeOut",
                                    }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    {isFilterExpanded ? (
                                        <X size={13} />
                                    ) : (
                                        <Filter size={13} />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <AnimatePresence initial={false}>
                            {!isFilterExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0, x: -6 }}
                                    animate={{
                                        opacity: 1,
                                        width: "auto",
                                        x: 0,
                                    }}
                                    exit={{ opacity: 0, width: 0, x: -6 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className="ml-1.5 flex items-center gap-1 overflow-hidden whitespace-nowrap"
                                >
                                    <span className="text-[11px] font-semibold">
                                        {t(
                                            LIBRARY_FILTER_TABS.find(
                                                (tab) =>
                                                    tab.key === activeFilter,
                                            )?.labelKey ||
                                                "library.filters.all",
                                        )}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] px-1.5 bg-walnut/10 text-darkBrown font-semibold rounded-full">
                                        {
                                            counts[
                                                activeFilter as keyof LibraryFilterCounts
                                            ]
                                        }
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    <AnimatePresence initial={false}>
                        {isFilterExpanded && (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "auto", opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{
                                    duration: 0.35,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="overflow-hidden"
                            >
                                <motion.div
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -10, opacity: 0 }}
                                    transition={{
                                        duration: 0.25,
                                        ease: "easeOut",
                                    }}
                                    className="flex items-center pl-1 gap-0.5 w-max"
                                >
                                    {LIBRARY_FILTER_TABS.filter(
                                        (tab) =>
                                            tab.key === "all" ||
                                            counts[tab.key] > 0,
                                    ).map((tab) => {
                                        const count = counts[tab.key];
                                        const active = activeFilter === tab.key;
                                        return (
                                            <button
                                                key={tab.key}
                                                onClick={() =>
                                                    onFilterSelect(tab.key)
                                                }
                                                className={`relative flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap z-10 select-none ${
                                                    active
                                                        ? "text-darkBrown"
                                                        : "text-walnut/70 hover:text-darkBrown hover:bg-white/30"
                                                }`}
                                                style={{
                                                    transition:
                                                        "color 0.2s ease, background-color 0.2s ease",
                                                }}
                                            >
                                                {active && (
                                                    <motion.div
                                                        layoutId="activeFilterTab"
                                                        className="absolute inset-0 bg-white rounded-lg shadow-xs z-[-1]"
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 450,
                                                            damping: 32,
                                                        }}
                                                    />
                                                )}
                                                <span className="relative z-10">
                                                    {t(tab.labelKey)}
                                                </span>
                                                <span
                                                    className={`relative z-10 text-[9px] sm:text-[10px] px-1.5 py-px rounded-full transition-colors duration-200 ${
                                                        active
                                                            ? "bg-walnut/10 text-darkBrown font-semibold"
                                                            : "bg-walnut/10 text-walnut/60 font-medium"
                                                    }`}
                                                >
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Widgets sitting on top of bookshelf rail / shelf card */}
            <div className="flex flex-shrink-0 items-end justify-center sm:justify-end gap-2 sm:gap-4 md:gap-5 relative z-10 w-full md:w-auto scale-80 xs:scale-85 sm:scale-95 md:scale-100 origin-bottom sm:origin-bottom-right mb-[-2px]">
                <FlipCalendar onClick={onOpenCalendar} />
                <div className="pb-1">
                    <BigDigitalClock />
                </div>
                <div className="pb-0.5">
                    <LightingControl />
                </div>
            </div>
        </div>
    );
}
