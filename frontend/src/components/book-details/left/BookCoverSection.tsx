import type { Book } from "../../../types";

interface BookCoverSectionProps {
    book: Book;
    c0: string;
    c1: string;
    c2: string;
}

export default function BookCoverSection({ book, c0, c1, c2 }: BookCoverSectionProps) {
    return (
        <div
            className="relative flex-shrink-0"
            style={{ width: 78, height: 110 }}
        >
            {/* front face */}
            <div
                className="absolute inset-0 rounded-r-sm flex flex-col items-center justify-center p-2 overflow-hidden"
                style={{
                    background: `linear-gradient(150deg, ${c0} 0%, ${c1} 55%, ${c2} 100%)`,
                    boxShadow: "4px 6px 16px rgba(0,0,0,0.45)",
                }}
            >
                {book.coverImage ? (
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-r-sm"
                    />
                ) : (
                    <>
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                background:
                                    "repeating-linear-gradient(180deg,transparent,transparent 3px,rgba(0,0,0,0.2) 4px)",
                            }}
                        />
                        <p
                            className="text-white text-center font-bold leading-tight relative z-10"
                            style={{
                                textShadow:
                                    "0 1px 4px rgba(0,0,0,0.5)",
                                fontSize: 8,
                            }}
                        >
                            {book.title}
                        </p>
                    </>
                )}
            </div>
            {/* spine left edge */}
            <div
                className="absolute left-0 top-0 bottom-0 rounded-l-sm"
                style={{
                    width: 10,
                    background: `linear-gradient(to right, ${c2}, ${c1})`,
                    boxShadow: "inset -1px 0 4px rgba(0,0,0,0.3)",
                    transform: "translateX(-10px) rotateY(-90deg)",
                    transformOrigin: "right center",
                }}
            />
            {/* reflection */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(130deg,rgba(255,255,255,0.18) 0%,transparent 60%)",
                }}
            />
        </div>
    );
}
