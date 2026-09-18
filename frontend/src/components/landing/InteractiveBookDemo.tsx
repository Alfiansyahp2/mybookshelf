import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

export interface EditorialBook {
    id: string;
    title: string;
    shortTitle?: string;
    author: string;
    category: string;
    language: "Bahasa Indonesia" | "English" | "Korean";
    pages: number;
    year: number;
    status: "Finished" | "Reading" | "Wishlist" | "Borrowed";
    coverGradient: string;
    coverImage?: string;
    synopsis: string;
    personalQuote: string;
    rating: number;
    tiltDegree?: number;
    heightPx: number;
    spineBg: string;
    textColor: string;
    c0: string;
    c1: string;
    c2: string;
}

export const DEMO_EDITORIAL_BOOKS: EditorialBook[] = [
    {
        id: "b1",
        title: "Berdamai dengan Diri Sendiri",
        shortTitle: "BERDAMAI DENGAN DIRI",
        author: "Muthia Sayekti",
        category: "PENGEMBANGAN DIRI (SELF-HELP)",
        language: "Bahasa Indonesia",
        pages: 160,
        year: 2020,
        status: "Finished",
        coverGradient: "from-[#4a3b2f] via-[#7a5c42] to-[#2c1d11]",
        coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1583802271i/52174246.jpg",
        synopsis: "Buku ini mengajak pembaca untuk berdamai dengan kekurangan, menghentikan kritik internal berlebihan, serta memeluk keunikan diri sendiri dengan penuh cinta dan penerimaan.",
        personalQuote: "Kedamaian terbesar dimulai saat kita menghentikan perang dengan diri sendiri.",
        rating: 5.0,
        tiltDegree: -2,
        heightPx: 310,
        spineBg: "bg-[#e8e0d5]",
        textColor: "text-[#4a3b2f]",
        c0: "#4a3b2f",
        c1: "#7a5c42",
        c2: "#2c1d11"
    },
    {
        id: "b2",
        title: "MAN'S SEARCH FOR MEANING",
        shortTitle: "MAN'S SEARCH FOR MEANING",
        author: "Viktor E. Frankl",
        category: "NONFICTION, PSYCHOLOGY, MEMOIR",
        language: "English",
        pages: 184,
        year: 1959,
        status: "Finished",
        coverGradient: "from-[#3a291d] via-[#593d29] to-[#1e130b]",
        coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535419394i/41735739.jpg",
        synopsis: "Kisah psikiater Viktor Frankl selama masa tahanan di kamp konsentrasi Nazi. Dari pengalaman pahit tersebut, Frankl melahirkan Logoterapi: pendorong utama manusia bukanlah kesenangan, melainkan pencarian makna hidup.",
        personalQuote: "He who has a why to live can bear almost any how.",
        rating: 5.0,
        tiltDegree: 3,
        heightPx: 330,
        spineBg: "bg-[#f8f5f0]",
        textColor: "text-[#4a3b2f]",
        c0: "#3a291d",
        c1: "#593d29",
        c2: "#1e130b"
    },
    {
        id: "b3",
        title: "The Hitchhiker's Guide to the Galaxy",
        shortTitle: "HITCHHIKER'S GUIDE TO GALAXY",
        author: "Douglas Adams",
        category: "SCI-FI, HUMOR, ADVENTURE",
        language: "English",
        pages: 224,
        year: 1979,
        status: "Reading",
        coverGradient: "from-[#7a5c42] via-[#a87d56] to-[#4a3b2f]",
        coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1559986152i/386162.jpg",
        synopsis: "Petualangan kocak Arthur Dent menembus antariksa setelah bumi dihancurkan untuk proyek pembangunan jalan tol galaksi. Jangan panik, dan selalu bawa handuk Anda!",
        personalQuote: "DON'T PANIC.",
        rating: 4.8,
        tiltDegree: -1,
        heightPx: 320,
        spineBg: "bg-[#ebdcc4]",
        textColor: "text-[#4a3b2f]",
        c0: "#7a5c42",
        c1: "#a87d56",
        c2: "#4a3b2f"
    },
    {
        id: "b4",
        title: "WHEN BREATH BECOMES AIR",
        shortTitle: "WHEN BREATH BECOMES AIR",
        author: "Paul Kalanithi",
        category: "MEMOIR, MEDICINE, BIOGRAPHY",
        language: "English",
        pages: 228,
        year: 2016,
        status: "Finished",
        coverGradient: "from-[#4a3b2f] via-[#6d4c33] to-[#23170e]",
        coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1492677644i/25899336.jpg",
        synopsis: "Refleksi mendalam seorang dokter spesialis bedah saraf muda yang didiagnosis kanker paru-paru stadium akhir. Sebuah renungan tentang hidup, kematian, dan apa yang membuat hidup bernilai.",
        personalQuote: "You can't ever reach perfection, but you can believe in an asymptote towards which you are ceaselessly striving.",
        rating: 5.0,
        tiltDegree: 2,
        heightPx: 320,
        spineBg: "bg-[#e8e0d5]",
        textColor: "text-[#4a3b2f]",
        c0: "#4a3b2f",
        c1: "#6d4c33",
        c2: "#23170e"
    },
    {
        id: "b5",
        title: "A CHESS STORY",
        shortTitle: "A CHESS STORY",
        author: "Stefan Zweig",
        category: "CLASSIC, NOVELLA, PSYCHOLOGY",
        language: "English",
        pages: 104,
        year: 1941,
        status: "Finished",
        coverGradient: "from-[#593d29] via-[#8c6543] to-[#2c1d11]",
        coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327914948i/176211.jpg",
        synopsis: "Kisah psikologis menegangkan di atas kapal samudra antara juara catur dunia dan seorang pengacara misterius yang mempelajari catur secara terisolasi selama penyiksaan Gestapo.",
        personalQuote: "Catur adalah sesuatu yang unik, berdiri di antara seni dan ilmu pengetahuan.",
        rating: 4.9,
        tiltDegree: -3,
        heightPx: 290,
        spineBg: "bg-[#f8f5f0]",
        textColor: "text-[#4a3b2f]",
        c0: "#593d29",
        c1: "#8c6543",
        c2: "#2c1d11"
    },
    {
        id: "b6",
        title: "THE SILENT PATIENT",
        shortTitle: "THE SILENT PATIENT",
        author: "Alex Michaelides",
        category: "THRILLER, PSYCHOLOGY, MYSTERY",
        language: "English",
        pages: 336,
        year: 2019,
        status: "Reading",
        coverGradient: "from-[#3a291d] via-[#5c4331] to-[#1e130b]",
        coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1668782119i/40092410.jpg",
        synopsis: "Alicia Berenson menembak suaminya lima kali di muka dan tidak pernah mengucapkan satu kata pun lagi. Seorang psikiater forensik terobsesi mengungkap rahasia di balik pembisuannya.",
        personalQuote: "Unexpressed emotions will never die. They are buried alive and will come forth later in uglier ways.",
        rating: 4.7,
        tiltDegree: 1,
        heightPx: 340,
        spineBg: "bg-[#e0d3c1]",
        textColor: "text-[#4a3b2f]",
        c0: "#3a291d",
        c1: "#5c4331",
        c2: "#1e130b"
    },
    {
        id: "b7",
        title: "MEOW A NOVEL",
        shortTitle: "MEOW A NOVEL",
        author: "Sam Austen",
        category: "FICTION, HUMOR",
        language: "English",
        pages: 112,
        year: 2021,
        status: "Wishlist",
        coverGradient: "from-[#7a5c42] via-[#9e7956] to-[#4a3b2f]",
        synopsis: "Sebuah novel eksperimental yang ditulis sepenuhnya dari perspektif dan kosakata seekor kucing. Unik, menghibur, dan penuh imajinasi.",
        personalQuote: "Meow meow meow.",
        rating: 4.5,
        tiltDegree: 4,
        heightPx: 315,
        spineBg: "bg-[#f8f5f0]",
        textColor: "text-[#7a5c42]",
        c0: "#7a5c42",
        c1: "#9e7956",
        c2: "#4a3b2f"
    },
    {
        id: "b8",
        title: "Laut Bercerita",
        shortTitle: "LAUT BERCERITA",
        author: "Leila S. Chudori",
        category: "FICTION, BIOGRAPHY, HISTORY",
        language: "Bahasa Indonesia",
        pages: 379,
        year: 2017,
        status: "Finished",
        coverGradient: "from-[#1d4ed8] via-[#1e40af] to-[#1e3a8a]",
        coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1507779767i/36395562.jpg",
        synopsis: "Kisah kekejaman dan penghilangan paksa aktivis mahasiswa aktivis masa Orde Baru. Diceritakan dari dua sudut pandang: mereka yang diculik di tempat gelap dan keluarga yang kehilangan.",
        personalQuote: "Matilah engkau mati, kau akan lahir berkali-kali.",
        rating: 5.0,
        tiltDegree: -2,
        heightPx: 335,
        spineBg: "bg-[#e8e0d5]",
        textColor: "text-[#4a3b2f]",
        c0: "#1d4ed8",
        c1: "#1e40af",
        c2: "#1e3a8a"
    },
    {
        id: "b9",
        title: "Filosofi Teras",
        shortTitle: "FILOSOFI TERAS",
        author: "Henry Manampiring",
        category: "PHILOSOPHY, SELF-HELP",
        language: "Bahasa Indonesia",
        pages: 346,
        year: 2018,
        status: "Finished",
        coverGradient: "from-[#7f1d1d] via-[#991b1b] to-[#450a0a]",
        coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1543387807i/42967675.jpg",
        synopsis: "Penerapan filsafat Stoikisme untuk mental yang tangguh dalam menghadapi rasa cemas, overthinking, dan ketidakpastian kehidupan modern.",
        personalQuote: "Kamu tidak bisa mengendalikan situasi, tapi kamu bisa mengendalikan responmu.",
        rating: 5.0,
        tiltDegree: 2,
        heightPx: 310,
        spineBg: "bg-[#f8f5f0]",
        textColor: "text-[#4a3b2f]",
        c0: "#7f1d1d",
        c1: "#991b1b",
        c2: "#450a0a"
    },
    {
        id: "b10",
        title: "The Little Prince",
        shortTitle: "THE LITTLE PRINCE",
        author: "Antoine de Saint-Exupéry",
        category: "CLASSIC, FICTION",
        language: "English",
        pages: 96,
        year: 1943,
        status: "Finished",
        coverGradient: "from-[#7a5c42] via-[#b88f68] to-[#4a3b2f]",
        coverImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1367545443i/157993.jpg",
        synopsis: "Kisah puitis seorang pangeran kecil yang mengembara dari planet ke planet, mengajarkan hakikat cinta, kesepian, persahabatan, dan hubungan manusia.",
        personalQuote: "It is only with the heart that one can see rightly; what is essential is invisible to the eye.",
        rating: 5.0,
        tiltDegree: -1,
        heightPx: 295,
        spineBg: "bg-[#f8f5f0]",
        textColor: "text-[#7a5c42]",
        c0: "#7a5c42",
        c1: "#b88f68",
        c2: "#4a3b2f"
    }
];

interface InteractiveBookDemoProps {
    statusFilter?: string;
    langFilter?: string;
}

export default function InteractiveBookDemo({ statusFilter = "All", langFilter = "Semua" }: InteractiveBookDemoProps) {
    const navigate = useNavigate();
    const [books] = useState<EditorialBook[]>(DEMO_EDITORIAL_BOOKS);
    const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);

    const handleSelectBook = (id: string) => {
        navigate(`/landing/book/${id}`);
    };

    return (
        <div className="w-full text-[#4a3b2f] font-sans">
            {/* MINIMALIST STANDING SPINES SHOWCASE WITH HOVER TOOLTIP */}
            <div className="relative py-6 px-2 sm:px-4 flex flex-wrap items-end justify-center gap-2 sm:gap-4 min-h-[360px] max-h-[385px]">
                {books.map((book) => {
                    const isStatusMatch = statusFilter === "All" || book.status === statusFilter;
                    const isLangMatch = langFilter === "Semua" || book.language === langFilter;
                    const isMatch = isStatusMatch && isLangMatch;
                    const isHovered = hoveredBookId === book.id;

                    return (
                        <div
                            key={book.id}
                            className="relative"
                            onMouseEnter={() => setHoveredBookId(book.id)}
                            onMouseLeave={() => setHoveredBookId(null)}
                        >
                            <motion.div
                                style={{
                                    height: `${book.heightPx}px`,
                                    transform: `rotate(${book.tiltDegree || 0}deg)`
                                }}
                                whileHover={{ y: -16, scale: 1.05 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleSelectBook(book.id)}
                                className={`cursor-pointer group relative w-10 sm:w-12 ${book.spineBg} ${book.textColor} rounded-sm shadow-xl transition-all duration-300 flex flex-col justify-between p-2 select-none border-t border-l border-white/80 overflow-hidden ${
                                    isMatch
                                        ? "opacity-100 hover:shadow-[#7a5c42]/30 hover:ring-2 hover:ring-[#4a3b2f]"
                                        : "opacity-25 grayscale-[60%] blur-[0.4px] scale-95 pointer-events-none"
                                }`}
                            >
                                {/* Top Spine Accent Star */}
                                <div className="w-full flex justify-center shrink-0 pt-0.5">
                                    <span className="text-[9px] text-[#d4a574]">★</span>
                                </div>

                                {/* Vertical Title Text */}
                                <div className="my-auto py-1 px-0.5 text-center flex items-center justify-center overflow-hidden flex-1">
                                    <span
                                        className="font-serif font-bold text-[10px] sm:text-xs tracking-wider uppercase leading-none overflow-hidden max-h-full"
                                        style={{
                                            writingMode: "vertical-rl",
                                            transform: "rotate(180deg)",
                                            maxHeight: `${book.heightPx - 70}px`,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: "vertical"
                                        }}
                                    >
                                        {book.shortTitle || book.title}
                                    </span>
                                </div>

                                {/* Bottom Spine Author */}
                                <div className="w-full text-center shrink-0 pb-0.5 overflow-hidden">
                                    <span
                                        className="text-[8px] font-semibold opacity-75 uppercase block tracking-tighter truncate"
                                        style={{
                                            writingMode: "vertical-rl",
                                            transform: "rotate(180deg)",
                                            maxHeight: "45px"
                                        }}
                                    >
                                        {book.author.split(" ")[0]}
                                    </span>
                                </div>
                            </motion.div>

                            {/* ── EXACT TOOLTIP POPUP FROM APP (PERSIS SCREENSHOT) ── */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.94 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.94 }}
                                        transition={{ duration: 0.16, ease: "easeOut" }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none w-56 sm:w-64 shadow-2xl rounded-2xl overflow-hidden border border-[#7a5c42]/20"
                                        style={{
                                            background: "rgba(253, 249, 243, 0.98)",
                                            backdropFilter: "blur(16px)",
                                            boxShadow: "0 14px 36px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0,0,0,0.1)"
                                        }}
                                    >
                                        {/* Top Accent Line */}
                                        <div
                                            className="h-1 w-full"
                                            style={{
                                                background: `linear-gradient(to right, ${book.c0}, ${book.c1})`
                                            }}
                                        />

                                        <div className="p-3.5 sm:p-4">
                                            {/* Mini Cover + Title & Author Header */}
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-14 rounded shadow-md overflow-hidden shrink-0 border border-black/15 bg-[#e8deca] relative">
                                                    {book.coverImage ? (
                                                        <img
                                                            src={book.coverImage}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className={`w-full h-full bg-gradient-to-tr ${book.coverGradient} p-1 flex flex-col justify-between text-white text-[7px]`}>
                                                            <span className="font-serif font-bold line-clamp-2 leading-tight">{book.title}</span>
                                                            <span className="text-[6px] opacity-75 truncate">{book.author}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0 pt-0.5">
                                                    <h5 className="font-serif font-bold text-xs sm:text-sm text-[#1c0f05] leading-snug line-clamp-2">
                                                        {book.title}
                                                    </h5>
                                                    <p className="text-[11px] font-serif italic text-[#7c5a3a] mt-0.5 truncate">
                                                        {book.author}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Category / Genre Pill Box */}
                                            <div className="mb-3 p-2 rounded-xl bg-[#dce7e5]/80 border border-[#b8cfcc]/70">
                                                <p className="text-[9.5px] font-bold tracking-wider text-[#3d6568] uppercase leading-tight font-sans">
                                                    {book.category}
                                                </p>
                                            </div>

                                            {/* Separator line */}
                                            <div className="h-[1px] bg-[#e8e0d5] mb-2.5" />

                                            {/* Status Badge & Rating Footer */}
                                            <div className="flex items-center justify-between text-xs font-semibold">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-semibold ${
                                                    book.status === "Finished"
                                                        ? "bg-[#dbeafe] text-[#1e40af]"
                                                        : book.status === "Reading"
                                                        ? "bg-[#dcfce7] text-[#166534]"
                                                        : "bg-[#f3e8ff] text-[#6b21a8]"
                                                }`}>
                                                    <span className={`w-2 h-2 rounded-full ${
                                                        book.status === "Finished"
                                                            ? "bg-[#3b82f6]"
                                                            : book.status === "Reading"
                                                            ? "bg-[#22c55e]"
                                                            : "bg-[#a855f7]"
                                                    }`} />
                                                    {book.status === "Finished" ? "Selesai" : book.status === "Reading" ? "Sedang Dibaca" : "Wishlist"}
                                                </span>

                                                <div className="flex items-center gap-1 text-xs font-bold text-[#4a3b2f]">
                                                    <Star className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                                                    <span>{book.rating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}

                {/* Bottom Baseline Floor Line */}
                <div className="absolute bottom-1 left-2 right-2 h-[2px] bg-[#7a5c42]/30 rounded-full" />
            </div>
        </div>
    );
}
