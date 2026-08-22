import { useTranslation } from "react-i18next";
import SEO from "../components/SEO";

export default function Statistics() {
    const { t } = useTranslation();
    return (
        <div className="p-8">
            <SEO title={t("navigation.statistics", "Statistics")} />
            <h1 className="text-3xl font-serif text-darkBrown mb-4">
                {t("statistics.title", "Statistics")}
            </h1>
            <p className="text-walnut/70">
                {t(
                    "statistics.coming_soon",
                    "Reading journey analytics coming soon...",
                )}
            </p>
        </div>
    );
}
