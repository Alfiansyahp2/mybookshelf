import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BookRatingSectionProps {
    userRating: number;
    handleRating: (r: number) => void;
}

export default function BookRatingSection({ userRating, handleRating }: BookRatingSectionProps) {
    const { t } = useTranslation();
    return (
        <div>
            <p
                className="text-[10px] uppercase tracking-widest mb-1.5 text-center"
                style={{ color: "#9c6d3a" }}
            >
                {t("bookDetail.your_rating", "Rating Kamu")}
            </p>
            <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                    <button
                        key={s}
                        onClick={() => handleRating(s)}
                        className="transition-transform hover:scale-115 active:scale-95"
                    >
                        <Star
                            className={`w-5 h-5 ${s <= userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
