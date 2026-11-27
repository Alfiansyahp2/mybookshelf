import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ACHIEVEMENT_BRAND } from "./achievementConfig";

interface AchievementsOverviewHeaderProps {
    unlockedCount: number;
    totalCount: number;
    completionPct: number;
}

export default function AchievementsOverviewHeader({
    unlockedCount,
    totalCount,
    completionPct,
}: AchievementsOverviewHeaderProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 32 }}
        >
            <h1
                style={{
                    fontSize: 28,
                    fontFamily: "'Georgia',serif",
                    fontWeight: 700,
                    color: ACHIEVEMENT_BRAND.darkBrown,
                    margin: "0 0 8px",
                }}
            >
                {t("achievements.title", "Pencapaian")}
            </h1>
            <p
                style={{
                    margin: 0,
                    color: ACHIEVEMENT_BRAND.walnut,
                    opacity: 0.8,
                }}
            >
                {t(
                    "achievements.subtitle",
                    "Lacak progres dan koleksi medali membaca kamu.",
                )}
            </p>

            {/* Progress Overview */}
            <div
                style={{
                    marginTop: 20,
                    padding: 20,
                    background: "white",
                    borderRadius: 16,
                    border: "1px solid rgba(139,99,56,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                }}
            >
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: ACHIEVEMENT_BRAND.beige,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Trophy size={32} color={ACHIEVEMENT_BRAND.walnut} />
                </div>
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 8,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: ACHIEVEMENT_BRAND.darkBrown,
                            }}
                        >
                            {t(
                                "achievements.total_achievements",
                                "Total Pencapaian",
                            )}
                        </span>
                        <span
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: ACHIEVEMENT_BRAND.walnut,
                            }}
                        >
                            {unlockedCount} / {totalCount}
                        </span>
                    </div>
                    <div
                        style={{
                            height: 8,
                            background: "rgba(139,99,56,0.1)",
                            borderRadius: 4,
                            overflow: "hidden",
                        }}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPct}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            style={{
                                height: "100%",
                                background: ACHIEVEMENT_BRAND.walnut,
                                borderRadius: 4,
                            }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
