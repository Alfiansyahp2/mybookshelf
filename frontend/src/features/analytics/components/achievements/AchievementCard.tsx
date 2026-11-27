import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    ACHIEVEMENT_BRAND,
    type ComputedAchievementItem,
} from "./achievementConfig";

interface AchievementCardProps {
    achievement: ComputedAchievementItem;
    index: number;
}

export default function AchievementCard({
    achievement,
    index,
}: AchievementCardProps) {
    const { t } = useTranslation();
    const Icon = achievement.icon;
    const progressPct = Math.min(
        (achievement.progress / achievement.target) * 100,
        100,
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{
                background: achievement.unlocked
                    ? "white"
                    : "rgba(255,255,255,0.4)",
                borderRadius: 16,
                border: `1px solid ${achievement.unlocked ? "rgba(139,99,56,0.15)" : "rgba(139,99,56,0.05)"}`,
                padding: 16,
                display: "flex",
                gap: 16,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Icon */}
            <div
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: achievement.unlocked
                        ? `${achievement.color}15`
                        : "rgba(139,99,56,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Icon
                    size={24}
                    color={
                        achievement.unlocked
                            ? achievement.color
                            : "rgba(139,99,56,0.3)"
                    }
                />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                    style={{
                        margin: "0 0 4px",
                        fontSize: 14,
                        fontWeight: 700,
                        color: achievement.unlocked
                            ? ACHIEVEMENT_BRAND.darkBrown
                            : "rgba(74,59,47,0.5)",
                    }}
                >
                    {t(
                        `achievements.items.${achievement.id}.title`,
                        achievement.title,
                    )}
                </h3>
                <p
                    style={{
                        margin: "0 0 12px",
                        fontSize: 11,
                        color: achievement.unlocked
                            ? ACHIEVEMENT_BRAND.walnut
                            : "rgba(122,92,66,0.5)",
                        lineHeight: 1.4,
                    }}
                >
                    {t(
                        `achievements.items.${achievement.id}.description`,
                        achievement.description,
                    )}
                </p>

                {/* Progress Bar */}
                {!achievement.unlocked && (
                    <div style={{ marginTop: "auto" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 4,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 10,
                                    color: "rgba(122,92,66,0.5)",
                                }}
                            >
                                {t("achievements.progress", "Progres")}
                            </span>
                            <span
                                style={{
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: "rgba(122,92,66,0.7)",
                                }}
                            >
                                {achievement.progress} / {achievement.target}
                            </span>
                        </div>
                        <div
                            style={{
                                height: 4,
                                background: "rgba(139,99,56,0.1)",
                                borderRadius: 2,
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${progressPct}%`,
                                    background: "rgba(139,99,56,0.3)",
                                    borderRadius: 2,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {achievement.unlocked && (
                <div
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                    }}
                >
                    <CheckCircle size={16} color={ACHIEVEMENT_BRAND.gold} />
                </div>
            )}
        </motion.div>
    );
}
