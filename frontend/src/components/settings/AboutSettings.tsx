import { motion } from "framer-motion";
import { Info, BookOpen, TrendingUp, Award, GitBranch } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AboutSettings() {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
        >
            <div className="bg-surface/95 rounded-2xl p-6 border border-walnut/15 dark:border-walnut/30 shadow-sm backdrop-blur-sm">
                <h2 className="text-xl font-serif font-semibold text-ink mb-6 flex items-center gap-2">
                    <Info className="w-5 h-5 text-walnut dark:text-gold" />
                    {t("settings.about.title", "About A?Bookshelf")}
                </h2>
                <div className="space-y-4">
                    <div className="p-4 bg-surfaceAlt/80 rounded-xl border border-walnut/10 dark:border-walnut/25">
                        <p className="text-sm text-walnut/85 dark:text-cream/75 mb-3">
                            {t(
                                "settings.about.description",
                                "A?Bookshelf is a beautiful and intuitive digital library management system designed for book lovers.",
                            )}
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <BookOpen className="w-4 h-4 text-walnut dark:text-gold" />
                                <span className="text-walnut/85 dark:text-cream/75">
                                    {t(
                                        "settings.about.feature1",
                                        "Organize your personal library",
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-walnut dark:text-gold" />
                                <span className="text-walnut/85 dark:text-cream/75">
                                    {t(
                                        "settings.about.feature2",
                                        "Track reading progress",
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Award className="w-4 h-4 text-walnut dark:text-gold" />
                                <span className="text-walnut/85 dark:text-cream/75">
                                    {t(
                                        "settings.about.feature3",
                                        "Achieve reading goals",
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-surfaceAlt/60 rounded-xl border border-walnut/20 dark:border-walnut/30 hover:border-walnut/40 transition-colors">
                            <div>
                                <p className="font-medium text-ink">
                                    {t("settings.about.version", "Version")}
                                </p>
                                <p className="text-sm text-walnut/75 dark:text-cream/65">
                                    1.0.0
                                </p>
                            </div>
                            <Info className="w-5 h-5 text-walnut/45 dark:text-gold/60" />
                        </div>

                        <a
                            href="https://mybookshelf.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-surfaceAlt/60 rounded-xl border border-walnut/20 dark:border-walnut/30 hover:border-walnut/40 hover:bg-walnut/5 dark:hover:bg-walnut/15 transition-colors group"
                        >
                            <div>
                                <p className="font-medium text-ink group-hover:text-walnut dark:group-hover:text-gold transition-colors">
                                    {t("settings.about.website", "Website")}
                                </p>
                                <p className="text-sm text-walnut/75 dark:text-cream/65">
                                    {t(
                                        "settings.about.website_desc",
                                        "Visit our official website",
                                    )}
                                </p>
                            </div>
                            <BookOpen className="w-5 h-5 text-walnut/45 dark:text-gold/60 group-hover:text-walnut dark:group-hover:text-gold transition-colors" />
                        </a>

                        <a
                            href="https://github.com/mybookshelf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-surfaceAlt/60 rounded-xl border border-walnut/20 dark:border-walnut/30 hover:border-walnut/40 hover:bg-walnut/5 dark:hover:bg-walnut/15 transition-colors group"
                        >
                            <div>
                                <p className="font-medium text-ink group-hover:text-walnut dark:group-hover:text-gold transition-colors">
                                    {t("settings.about.github", "GitHub")}
                                </p>
                                <p className="text-sm text-walnut/75 dark:text-cream/65">
                                    {t(
                                        "settings.about.github_desc",
                                        "View source code",
                                    )}
                                </p>
                            </div>
                            <GitBranch className="w-5 h-5 text-walnut/45 dark:text-gold/60 group-hover:text-walnut dark:group-hover:text-gold transition-colors" />
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
