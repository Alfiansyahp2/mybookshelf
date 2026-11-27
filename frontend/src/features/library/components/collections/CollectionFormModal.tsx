import type { FormEvent } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
    COLLECTION_PRESET_COLORS,
    COLLECTION_PRESET_ICONS,
} from "./presets";

interface CollectionFormModalProps {
    isOpen: boolean;
    isEditing: boolean;
    name: string;
    description: string;
    icon: string;
    color: string;
    isSubmitting: boolean;
    onClose: () => void;
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onIconChange: (value: string) => void;
    onColorChange: (value: string) => void;
    onSubmit: (e: FormEvent) => void;
}

export default function CollectionFormModal({
    isOpen,
    isEditing,
    name,
    description,
    icon,
    color,
    isSubmitting,
    onClose,
    onNameChange,
    onDescriptionChange,
    onIconChange,
    onColorChange,
    onSubmit,
}: CollectionFormModalProps) {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1e1712] rounded-2xl shadow-2xl w-full max-w-md border border-walnut/15 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-walnut/10">
                    <h2 className="font-serif font-bold text-lg text-darkBrown dark:text-cream">
                        {isEditing
                            ? t("collections.edit_title", "Edit Collection")
                            : t("collections.create_title", "New Collection")}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-walnut/10 text-walnut"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-walnut mb-1">
                            {t("collections.name_label", "Name")}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => onNameChange(e.target.value)}
                            placeholder={t(
                                "collections.name_placeholder",
                                "e.g. Classic Sci-Fi",
                            )}
                            className="w-full px-3 py-2 rounded-xl border border-walnut/20 bg-white dark:bg-[#120e0a] text-sm text-darkBrown dark:text-cream"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-walnut mb-1">
                            {t("collections.description_label", "Description")}
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => onDescriptionChange(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-walnut/20 bg-white dark:bg-[#120e0a] text-sm text-darkBrown dark:text-cream"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-walnut mb-1.5">
                                {t("collections.icon_label", "Icon")}
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {COLLECTION_PRESET_ICONS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => onIconChange(emoji)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-base border ${
                                            icon === emoji
                                                ? "border-walnut bg-walnut/15"
                                                : "border-walnut/15"
                                        }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-walnut mb-1.5">
                                {t("collections.color_label", "Color")}
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {COLLECTION_PRESET_COLORS.map((swatch) => (
                                    <button
                                        key={swatch}
                                        type="button"
                                        onClick={() => onColorChange(swatch)}
                                        className={`w-7 h-7 rounded-full border-2 ${
                                            color === swatch
                                                ? "border-darkBrown scale-110"
                                                : "border-transparent"
                                        }`}
                                        style={{ backgroundColor: swatch }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-walnut/20 text-sm font-medium text-walnut hover:bg-walnut/5"
                        >
                            {t("common.cancel", "Cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-xl bg-walnut hover:bg-darkBrown text-white text-sm font-semibold disabled:opacity-50"
                        >
                            {t("common.save", "Save")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
