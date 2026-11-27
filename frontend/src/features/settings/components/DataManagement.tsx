import { motion } from "framer-motion";
import { Database, Download, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DataManagementProps {
    handleExportData: () => void;
    handleClearData: () => void;
}

export default function DataManagement({
    handleExportData,
    handleClearData,
}: DataManagementProps) {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
            <div className="bg-surface/95 rounded-2xl p-6 border border-walnut/15 dark:border-walnut/30 shadow-sm backdrop-blur-sm">
                <h2 className="text-xl font-serif font-semibold text-ink mb-6 flex items-center gap-2">
                    <Database className="w-5 h-5 text-walnut dark:text-gold" />
                    {t("settings.data.data_management", "Data Management")}
                </h2>
                <div className="space-y-3">
                    <button
                        onClick={handleExportData}
                        className="w-full flex items-center gap-3 px-4 py-4 bg-walnut text-white rounded-xl hover:bg-darkBrown transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        <span className="font-medium">
                            {t("settings.data.export_data", "Export All Data")}
                        </span>
                    </button>

                    <div className="bg-surfaceAlt/80 rounded-xl p-4 border border-walnut/10 dark:border-walnut/25">
                        <p className="text-sm text-walnut/85 dark:text-cream/75 mb-2">
                            {t(
                                "settings.data.export_desc",
                                "This will download all your books, settings, and reading progress as a JSON file that you can import later.",
                            )}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-walnut/65 dark:text-cream/55">
                            <Database className="w-4 h-4" />
                            <span>
                                {t(
                                    "settings.data.file_size",
                                    "File size: ~50KB",
                                )}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleClearData}
                        className="w-full flex items-center gap-3 px-4 py-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors border-2 border-red-200 dark:border-red-900/50"
                    >
                        <Trash2 className="w-5 h-5" />
                        <span className="font-medium">
                            {t("settings.data.clear_data", "Clear All Data")}
                        </span>
                    </button>

                    <div className="bg-red-50 dark:bg-red-950/35 rounded-xl p-4 border-2 border-red-200 dark:border-red-900/45">
                        <p className="text-sm text-red-800 dark:text-red-300">
                            <strong>
                                {t("settings.data.warning", "Warning")}:
                            </strong>{" "}
                            {t(
                                "settings.data.warning_desc",
                                "This will permanently delete all your books, settings, and reading progress. This action cannot be undone.",
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
