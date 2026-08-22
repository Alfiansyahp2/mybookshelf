import { useTranslation } from "react-i18next";
import SEO from "../components/SEO";

export default function Collections() {
    const { t } = useTranslation();
    return (
        <div className="p-8">
            <SEO title={t("navigation.collections", "Collections")} />
            <h1 className="text-3xl font-serif text-darkBrown mb-4">
                {t("collections.title", "Collections")}
            </h1>
            <p className="text-walnut/70">
                {t("collections.coming_soon", "Coming soon...")}
            </p>
        </div>
    );
}
