import { Calendar, ShoppingBag, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BookPurchaseInputProps {
    formData: any;
    setFormData: (data: any) => void;
}

export default function BookPurchaseInput({
    formData,
    setFormData,
}: BookPurchaseInputProps) {
    const { t } = useTranslation();
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">
                {t("book_form.purchase.title_section")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Purchase/Gift Toggle */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-walnut mb-1.5">
                        {t("book_form.purchase.acquisition_type")}
                    </label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    acquisitionType: "purchased",
                                })
                            }
                            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                formData.acquisitionType === "purchased"
                                    ? "bg-walnut text-white shadow"
                                    : "bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20"
                            }`}
                        >
                            {t("book_form.purchase.type_purchased")}
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    acquisitionType: "gift",
                                })
                            }
                            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                formData.acquisitionType === "gift"
                                    ? "bg-walnut text-white shadow"
                                    : "bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20"
                            }`}
                        >
                            {t("book_form.purchase.type_gift")}
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({
                                    ...formData,
                                    acquisitionType: "borrowed",
                                })
                            }
                            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                formData.acquisitionType === "borrowed"
                                    ? "bg-walnut text-white shadow"
                                    : "bg-white text-walnut/70 hover:bg-walnut/10 border border-walnut/20"
                            }`}
                        >
                            {t("book_form.purchase.type_borrowed")}
                        </button>
                    </div>
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-walnut mb-1.5">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {t("book_form.purchase.date")}
                    </label>
                    <input
                        type="date"
                        value={formData.purchaseDate || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                purchaseDate: e.target.value,
                            })
                        }
                        className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm text-walnut"
                    />
                </div>

                {/* Price - Only show if purchased */}
                {formData.acquisitionType === "purchased" && (
                    <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5 flex items-center">
                            <ShoppingBag className="w-4 h-4 inline mr-1" />{" "}
                            {t("book_form.purchase.price")}
                        </label>
                        <div className="flex relative">
                            <select
                                value={formData.purchaseCurrency || "IDR"}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        purchaseCurrency: e.target.value,
                                    })
                                }
                                className="absolute left-1 top-1.5 bottom-1.5 bg-transparent border-r border-walnut/20 text-walnut/80 text-sm focus:outline-none px-2 rounded-l-lg z-10"
                            >
                                <option value="IDR">Rp</option>
                                <option value="USD">$</option>
                                <option value="EUR">€</option>
                                <option value="GBP">£</option>
                                <option value="JPY">¥</option>
                            </select>
                            <input
                                type="text"
                                value={
                                    formData.purchasePrice
                                        ? (formData.purchaseCurrency === "IDR" || formData.purchaseCurrency === "JPY")
                                            ? (() => {
                                                  const parsed = parseInt(formData.purchasePrice.toString().replace(/[^\d]/g, ''), 10);
                                                  return isNaN(parsed) ? "" : parsed.toLocaleString('id-ID');
                                              })()
                                            : formData.purchasePrice
                                        : ""
                                }
                                onChange={(e) => {
                                    let rawValue = e.target.value;
                                    if (formData.purchaseCurrency === "IDR" || formData.purchaseCurrency === "JPY") {
                                        rawValue = rawValue.replace(/[^\d]/g, '');
                                    } else {
                                        rawValue = rawValue.replace(/[^\d.]/g, '');
                                        const parts = rawValue.split('.');
                                        if (parts.length > 2) {
                                            rawValue = parts[0] + '.' + parts.slice(1).join('');
                                        }
                                    }
                                    setFormData({
                                        ...formData,
                                        purchasePrice: rawValue,
                                    })
                                }}
                                className="w-full pl-16 pr-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                                placeholder="0"
                            />
                        </div>
                    </div>
                )}

                {/* Location / Shop - Only show if purchased */}
                {formData.acquisitionType === "purchased" && (
                    <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5 flex items-center">
                            <MapPin className="w-4 h-4 inline mr-1" />{" "}
                            {t("book_form.purchase.location")}
                        </label>
                        <input
                            type="text"
                            value={formData.purchaseLocation || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    purchaseLocation: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm text-walnut"
                            placeholder={t(
                                "book_form.purchase.location_placeholder",
                            )}
                        />
                    </div>
                )}

                {/* Gift From */}
                {formData.acquisitionType === "gift" && (
                    <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                            🎁 {t("book_form.purchase.gift_from")}
                        </label>
                        <input
                            type="text"
                            value={formData.giftFrom || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    giftFrom: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm text-walnut"
                            placeholder={t(
                                "book_form.purchase.gift_placeholder",
                            )}
                        />
                    </div>
                )}

                {/* Borrowed From */}
                {formData.acquisitionType === "borrowed" && (
                    <div>
                        <label className="block text-sm font-medium text-walnut mb-1.5">
                            👤 {t("book_form.purchase.borrowed_from")}
                        </label>
                        <input
                            type="text"
                            value={formData.borrowedFrom || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    borrowedFrom: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm text-walnut"
                            placeholder={t(
                                "book_form.purchase.borrowed_placeholder",
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
