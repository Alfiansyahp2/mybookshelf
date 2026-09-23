import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    type EditorialBook,
    DEMO_EDITORIAL_BOOKS
} from "../../constants/editorialBooks";
import DesktopBookShelf from "./DesktopBookShelf";
import MobileBookShelf from "./MobileBookShelf";

// Re-export for backward compatibility (e.g. LandingBookDetail.tsx)
export { type EditorialBook, DEMO_EDITORIAL_BOOKS } from "../../constants/editorialBooks";

interface InteractiveBookDemoProps {
    statusFilter?: string;
    langFilter?: string;
}

export default function InteractiveBookDemo({
    statusFilter = "All",
    langFilter = "Semua"
}: InteractiveBookDemoProps) {
    const navigate = useNavigate();
    const [books] = useState<EditorialBook[]>(DEMO_EDITORIAL_BOOKS);
    const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);
    const [trainIndex, setTrainIndex] = useState(0);
    const [activeMobileBookId, setActiveMobileBookId] = useState<string | null>(null);
    const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

    const handleSelectBook = (id: string) => {
        navigate(`/landing/book/${id}`);
    };

    return (
        <div className="w-full text-[#4a3b2f] font-sans">
            {/* Desktop & Tablet Showcase with hover tooltips and Anime.js stagger */}
            <DesktopBookShelf
                books={books}
                statusFilter={statusFilter}
                langFilter={langFilter}
                hoveredBookId={hoveredBookId}
                setHoveredBookId={setHoveredBookId}
                onSelectBook={handleSelectBook}
                imgErrors={imgErrors}
                setImgErrors={setImgErrors}
            />

            {/* Mobile Showcase with infinite sliding train, natural tilts, blur edges & pop-up modal */}
            <MobileBookShelf
                books={books}
                onSelectBook={handleSelectBook}
                activeMobileBookId={activeMobileBookId}
                setActiveMobileBookId={setActiveMobileBookId}
                trainIndex={trainIndex}
                setTrainIndex={setTrainIndex}
                imgErrors={imgErrors}
                setImgErrors={setImgErrors}
            />
        </div>
    );
}
