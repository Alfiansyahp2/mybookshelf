import {
    BookOpen,
    FileText,
    Hash,
    Globe,
    Calendar,
    Package,
} from "lucide-react";
import { BOOK_GENRES } from "../../constants/genres";
import { useTranslation } from "react-i18next";

interface BookBasicInfoInputProps {
    formData: any;
    setFormData: (data: any) => void;
}

export default function BookBasicInfoInput({
    formData,
    setFormData,
}: BookBasicInfoInputProps) {
    const { t } = useTranslation();
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-walnut/80 uppercase tracking-wider">
                {t("book_form.basic.title_section")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-walnut mb-1.5">
                        <BookOpen className="w-4 h-4 inline mr-1" />
                        {t("book_form.basic.title")}
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm text-walnut"
                        placeholder={t("book_form.basic.title_placeholder")}
                    />
                </div>

                {/* Author */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-walnut mb-1.5">
                        <FileText className="w-4 h-4 inline mr-1" />
                        {t("book_form.basic.author")}
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.author}
                        onChange={(e) =>
                            setFormData({ ...formData, author: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm text-walnut"
                        placeholder={t("book_form.basic.author_placeholder")}
                    />
                </div>

                {/* ISBN */}
                <div>
                    <label className="block text-sm font-medium text-walnut mb-1.5">
                        <Hash className="w-4 h-4 inline mr-1" />
                        {t("book_form.basic.isbn")}
                    </label>
                    <input
                        type="text"
                        value={formData.isbn}
                        onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9X]/gi, '').toUpperCase();
                            let formatted = val;

                            if (val.length > 3) {
                                const prefix = val.substring(0, 3);
                                const rest = val.substring(3);
                                
                                if (prefix === '978' || prefix === '979') {
                                    const group = rest.substring(0, 3);
                                    if (group.startsWith('623') || group.startsWith('602')) {
                                        // 3-3-4-2-1 format (Indonesia)
                                        formatted = prefix;
                                        if (rest.length > 0) formatted += '-' + rest.substring(0, 3);
                                        if (rest.length > 3) formatted += '-' + rest.substring(3, 7);
                                        if (rest.length > 7) formatted += '-' + rest.substring(7, 9);
                                        if (rest.length > 9) formatted += '-' + rest.substring(9, 10);
                                    } else {
                                        const first = rest.charAt(0);
                                        if (['0', '1', '2', '3', '4', '7'].includes(first)) {
                                            // 3-1-4-4-1 format (International)
                                            formatted = prefix;
                                            if (rest.length > 0) formatted += '-' + rest.substring(0, 1);
                                            if (rest.length > 1) formatted += '-' + rest.substring(1, 5);
                                            if (rest.length > 5) formatted += '-' + rest.substring(5, 9);
                                            if (rest.length > 9) formatted += '-' + rest.substring(9, 10);
                                        } else {
                                            // generic fallback 3-2-4-3-1
                                            formatted = prefix;
                                            if (rest.length > 0) formatted += '-' + rest.substring(0, 2);
                                            if (rest.length > 2) formatted += '-' + rest.substring(2, 6);
                                            if (rest.length > 6) formatted += '-' + rest.substring(6, 9);
                                            if (rest.length > 9) formatted += '-' + rest.substring(9, 10);
                                        }
                                    }
                                }
                            }
                            setFormData({ ...formData, isbn: formatted });
                        }}
                        className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm text-walnut"
                        placeholder="978-623-XXXX-XX-X"
                        maxLength={17}
                    />
                </div>

                {/* Genre */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-walnut mb-1.5">
                        <Globe className="w-4 h-4 inline mr-1" />
                        {t("book_form.basic.genre")}
                    </label>
                    <div className="space-y-4">
                        {BOOK_GENRES.map((group) => (
                            <div key={group.category}>
                                <h4 className="text-xs font-bold text-walnut/60 mb-2 uppercase tracking-wider">
                                    {group.category}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {group.genres.map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => {
                                                const newGenres =
                                                    formData.genres.includes(g)
                                                        ? formData.genres.filter(
                                                              (x: string) =>
                                                                  x !== g,
                                                          )
                                                        : [
                                                              ...formData.genres,
                                                              g,
                                                          ];
                                                setFormData({
                                                    ...formData,
                                                    genres: newGenres,
                                                });
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                                formData.genres.includes(g)
                                                    ? "bg-walnut text-white"
                                                    : "bg-walnut/10 text-walnut/80 hover:bg-walnut/20"
                                            }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="flex gap-2 pt-2 border-t border-walnut/10">
                            <input
                                type="text"
                                placeholder={t("book_form.basic.custom_genre")}
                                className="flex-1 px-4 py-2 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        const val =
                                            e.currentTarget.value.trim();
                                        if (
                                            val &&
                                            !formData.genres.includes(val)
                                        ) {
                                            setFormData({
                                                ...formData,
                                                genres: [
                                                    ...formData.genres,
                                                    val,
                                                ],
                                            });
                                        }
                                        e.currentTarget.value = "";
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Publisher */}
                <div>
                    <label className="block text-sm font-medium text-walnut mb-1.5">
                        {t("book_form.basic.publisher")}
                    </label>
                    <input
                        type="text"
                        value={formData.publisher}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                publisher: e.target.value,
                            })
                        }
                        className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm text-walnut"
                        placeholder={t("book_form.basic.publisher_placeholder")}
                    />
                </div>

                {/* Language */}
                <div>
                    <label className="block text-sm font-medium text-walnut mb-1.5">
                        {t("book_form.basic.language")}
                    </label>
                    <select
                        value={formData.language}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                language: e.target.value,
                            })
                        }
                        className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm text-walnut"
                    >
                        <option value="Indonesian">Indonesia</option>
                        <option value="English">Inggris</option>
                        <option value="Japanese">Jepang</option>
                        <option value="Korean">Korea</option>
                        <option value="Chinese">Mandarin</option>
                        <option value="Arabic">Arab</option>
                        <option value="Spanish">Spanyol</option>
                        <option value="French">Prancis</option>
                        <option value="German">Jerman</option>
                        <option value="Dutch">Belanda</option>
                        <option value="Other">Lainnya</option>
                    </select>
                </div>

                {/* Publish Year */}
                <div>
                    <label className="block text-sm font-medium text-walnut mb-1.5">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {t("book_form.basic.year")}
                    </label>
                    <input
                        type="number"
                        required
                        min="1000"
                        max={new Date().getFullYear() + 1}
                        value={formData.publishYear || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                publishYear: e.target.value,
                            })
                        }
                        className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm text-walnut"
                    />
                </div>

                {/* Pages */}
                <div>
                    <label className="block text-sm font-medium text-walnut mb-1.5">
                        {t("book_form.basic.pages")}
                    </label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={formData.pages || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, pages: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm text-walnut"
                        placeholder={t("book_form.basic.pages_placeholder")}
                    />
                </div>

                {/* Format */}
                <div>
                    <label className="block text-sm font-medium text-walnut mb-1.5">
                        <Package className="w-4 h-4 inline mr-1" />
                        {t("book_form.basic.format")}
                    </label>
                    <select
                        value={formData.format}
                        onChange={(e) =>
                            setFormData({ ...formData, format: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-cream border border-walnut/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut/30 focus:border-walnut/50 text-sm text-walnut"
                    >
                        <option value="hardcover">Hardcover</option>
                        <option value="paperback">Paperback</option>
                        <option value="ebook">E-book</option>
                        <option value="audiobook">Audiobook</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
