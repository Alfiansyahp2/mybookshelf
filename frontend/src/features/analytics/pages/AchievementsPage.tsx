import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@shared/components/ui/SEO";
import { useAchievements } from "../hooks/useAchievements";
import AchievementsOverviewHeader from "../components/achievements/AchievementsOverviewHeader";
import AchievementCard from "../components/achievements/AchievementCard";
import {
    ACHIEVEMENT_BRAND,
    mapApiAchievementsToItems,
} from "../components/achievements/achievementConfig";

export default function AchievementsPage() {
    const { t } = useTranslation();
    const { data: apiAchievements = [], isLoading } = useAchievements();

    const achievementsList = useMemo(
        () => mapApiAchievementsToItems(apiAchievements, t),
        [apiAchievements, t],
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <SEO title={t("navigation.achievements", "Achievements")} />
                <p style={{ color: ACHIEVEMENT_BRAND.walnut, fontSize: 13 }}>
                    {t("achievements.loading", "Memuat pencapaian…")}
                </p>
            </div>
        );
    }

    const unlockedCount = achievementsList.filter((a) => a.unlocked).length;
    const completionPct =
        achievementsList.length > 0
            ? Math.round((unlockedCount / achievementsList.length) * 100)
            : 0;

    return (
        <div
            className="pt-[88px] md:pt-[100px]"
            style={{
                paddingBottom: "40px",
                paddingLeft: "20px",
                paddingRight: "20px",
                maxWidth: 1000,
                margin: "0 auto",
            }}
        >
            <SEO title={t("navigation.achievements", "Achievements")} />
            <AchievementsOverviewHeader
                unlockedCount={unlockedCount}
                totalCount={achievementsList.length}
                completionPct={completionPct}
            />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 16,
                }}
            >
                {achievementsList.map((ach, index) => (
                    <AchievementCard
                        key={ach.id}
                        achievement={ach}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
}
