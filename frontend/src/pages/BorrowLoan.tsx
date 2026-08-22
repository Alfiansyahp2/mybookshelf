import { useTranslation } from "react-i18next";
import SEO from "../components/SEO";

export default function BorrowLoan() {
    const { t } = useTranslation();
    return (
        <div className="p-8">
            <SEO title={t("navigation.borrowloan", "BorrowLoan")} />
            <h1 className="text-3xl font-serif text-darkBrown mb-4">
                {t("borrow.title", "Borrow & Loan")}
            </h1>
            <p className="text-walnut/70">
                {t("borrow.coming_soon", "Coming soon...")}
            </p>
        </div>
    );
}
