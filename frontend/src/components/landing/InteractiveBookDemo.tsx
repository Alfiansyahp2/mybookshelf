import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { animate, stagger } from "animejs";

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
        coverImage: "https://covers.openlibrary.org/b/isbn/9786020638522-L.jpg",
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
        title: "Man's Search for Meaning",
        shortTitle: "Man's Search for Meaning",
        author: "Viktor E. Frankl",
        category: "NONFICTION, PSYCHOLOGY, MEMOIR",
        language: "English",
        pages: 184,
        year: 1959,
        status: "Finished",
        coverGradient: "from-[#134e4a] via-[#0d9488] to-[#ea580c]",
        coverImage: "/covers/mans-search-for-meaning.jpg",
        synopsis: "Kisah psikiater Viktor Frankl selama masa tahanan di kamp konsentrasi Nazi. Dari pengalaman pahit tersebut, Frankl melahirkan Logoterapi: pendorong utama manusia bukanlah kesenangan, melainkan pencarian makna hidup.",
        personalQuote: "He who has a why to live can bear almost any how.",
        rating: 5.0,
        tiltDegree: 3,
        heightPx: 330,
        spineBg: "bg-[#0d9488]",
        textColor: "text-[#f8f5f0]",
        c0: "#134e4a",
        c1: "#0d9488",
        c2: "#ea580c"
    },
    {
        id: "b3",
        title: "1984",
        shortTitle: "1984",
        author: "George Orwell",
        category: "DYSTOPIAN, CLASSIC, FICTION",
        language: "English",
        pages: 328,
        year: 1950,
        status: "Finished",
        coverGradient: "from-[#0e7490] via-[#0891b2] to-[#facc15]",
        coverImage: "/covers/1984.jpg",
        synopsis: "Penggambaran mencekam dan penuh refleksi tentang totalitarianisme, Big Brother, Newspeak, dan pengawasan pikiran dalam tatanan masyarakat distopia.",
        personalQuote: "Who controls the past controls the future: who controls the present controls the past.",
        rating: 5.0,
        tiltDegree: -1,
        heightPx: 320,
        spineBg: "bg-[#0e7490]",
        textColor: "text-[#f8f5f0]",
        c0: "#0e7490",
        c1: "#0891b2",
        c2: "#facc15"
    },
    {
        id: "b4",
        title: "Janji",
        shortTitle: "JANJI",
        author: "Tere Liye",
        category: "FICTION, DRAMA, NOVEL",
        language: "Bahasa Indonesia",
        pages: 488,
        year: 2021,
        status: "Finished",
        coverGradient: "from-[#dc2626] via-[#b91c1c] to-[#7f1d1d]",
        coverImage: "/covers/janji.jpg",
        synopsis: "Sebuah novel karya Tere Liye yang mengisahkan perjalanan pencarian, pengampunan, dan makna sebuah janji. Sebuah petualangan emosional yang menyentuh hati tentang persahabatan, penebusan dosa, dan takdir.",
        personalQuote: "Ada janji yang harus ditepati, tidak peduli seberapa jauh dan sulit jalan yang harus ditempuh.",
        rating: 5.0,
        tiltDegree: 2,
        heightPx: 320,
        spineBg: "bg-[#dc2626]",
        textColor: "text-[#ffffff]",
        c0: "#dc2626",
        c1: "#b91c1c",
        c2: "#7f1d1d"
    },
    {
        id: "b5",
        title: "Malioboro at Midnight",
        shortTitle: "MALIOBORO AT MIDNIGHT",
        author: "Skysphire",
        category: "ROMANCE, DRAMA, INDONESIAN FICTION",
        language: "Bahasa Indonesia",
        pages: 360,
        year: 2023,
        status: "Finished",
        coverGradient: "from-[#09090b] via-[#18181b] to-[#facc15]",
        coverImage: "/covers/malioboro-at-midnight.jpg",
        synopsis: "Kisah romansa hangat dan menyentuh berlatar belakang sudut kota Yogyakarta di malam hari. Penulisan emosional tentang kesempatan kedua, menyembuhkan luka masa lalu, dan kehangatan hubungan manusia.",
        personalQuote: "Di bawah langit Malioboro tengah malam, beberapa kisah tidak pernah benar-benar selesai.",
        rating: 5.0,
        tiltDegree: -3,
        heightPx: 330,
        spineBg: "bg-[#18181b]",
        textColor: "text-[#f8f5f0]",
        c0: "#09090b",
        c1: "#18181b",
        c2: "#facc15"
    },
    {
        id: "b6",
        title: "Tuesdays with Morrie",
        shortTitle: "TUESDAYS WITH MORRIE",
        author: "Mitch Albom",
        category: "MEMOIR, BIOGRAPHY, PHILOSOPHY",
        language: "English",
        pages: 192,
        year: 1997,
        status: "Finished",
        coverGradient: "from-[#fef3c7] via-[#991b1b] to-[#4c1d95]",
        coverImage: "/covers/tuesdays-with-morrie.jpg",
        synopsis: "Sebuah memoar yang mengharukan tentang hubungan antara Mitch Albom dan mantan profesor sosiologinya, Morrie Schwartz, yang menderita ALS. Pertemuan setiap hari Selasa memberikan pelajaran hidup paling berharga tentang cinta, pekerjaan, penuaan, dan kematian.",
        personalQuote: "The most important thing in life is to learn how to give out love, and to let it come in.",
        rating: 5.0,
        tiltDegree: 1,
        heightPx: 335,
        spineBg: "bg-[#fef3c7]",
        textColor: "text-[#991b1b]",
        c0: "#991b1b",
        c1: "#4c1d95",
        c2: "#fef3c7"
    },
    {
        id: "b7",
        title: "The Courage to Like Yourself",
        shortTitle: "COURAGE TO LIKE YOURSELF",
        author: "Ichiro Kishimi & Fumitake Koga",
        category: "PSYCHOLOGY, PHILOSOPHY, SELF-HELP",
        language: "English",
        pages: 288,
        year: 2021,
        status: "Finished",
        coverGradient: "from-[#fef08a] via-[#eab308] to-[#0284c7]",
        coverImage: "/covers/courage-to-like-yourself.jpg",
        synopsis: "Sebuah panduan psikologi Adlerian yang membuka wawasan tentang pentingnya menerima diri sendiri, membebaskan diri dari ekspektasi orang lain, dan menemukan keberanian untuk mencintai diri apa adanya.",
        personalQuote: "Accept yourself and everything changes... The courage to be happy starts with the courage to accept who you are.",
        rating: 5.0,
        tiltDegree: 4,
        heightPx: 325,
        spineBg: "bg-[#fef08a]",
        textColor: "text-[#0284c7]",
        c0: "#0284c7",
        c1: "#06b6d4",
        c2: "#facc15"
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
        coverGradient: "from-[#0f172a] via-[#1e40af] to-[#0284c7]",
        coverImage: "/covers/laut-bercerita.jpg",
        synopsis: "Kisah kekejaman dan penghilangan paksa aktivis mahasiswa aktivis masa Orde Baru. Diceritakan dari dua sudut pandang: mereka yang diculik di tempat gelap dan keluarga yang kehilangan.",
        personalQuote: "Matilah engkau mati, kau akan lahir berkali-kali.",
        rating: 5.0,
        tiltDegree: -2,
        heightPx: 335,
        spineBg: "bg-[#dbeafe]",
        textColor: "text-[#1e40af]",
        c0: "#1e40af",
        c1: "#0284c7",
        c2: "#ea580c"
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
        coverGradient: "from-[#0284c7] via-[#06b6d4] to-[#facc15]",
        coverImage: "/covers/filosofi-teras.png",
        synopsis: "Penerapan filsafat Stoikisme untuk mental yang tangguh dalam menghadapi rasa cemas, overthinking, dan ketidakpastian kehidupan modern.",
        personalQuote: "Kamu tidak bisa mengendalikan situasi, tapi kamu bisa mengendalikan responmu.",
        rating: 5.0,
        tiltDegree: 2,
        heightPx: 310,
        spineBg: "bg-[#fef08a]",
        textColor: "text-[#0e7490]",
        c0: "#0284c7",
        c1: "#06b6d4",
        c2: "#facc15"
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
        coverGradient: "from-[#172554] via-[#1e3a8a] to-[#2563eb]",
        coverImage: "/covers/the-little-prince.jpg",
        synopsis: "Kisah puitis seorang pangeran kecil yang mengembara dari planet ke planet, mengajarkan hakikat cinta, kesepian, persahabatan, dan hubungan manusia.",
        personalQuote: "It is only with the heart that one can see rightly; what is essential is invisible to the eye.",
        rating: 5.0,
        tiltDegree: -1,
        heightPx: 295,
        spineBg: "bg-[#1e3a8a]",
        textColor: "text-[#fef08a]",
        c0: "#172554",
        c1: "#1e3a8a",
        c2: "#facc15"
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
    const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const anim = animate(".demo-spine-item", {
            translateY: [45, 0],
            opacity: [0, 1],
            delay: stagger(55, { start: 150 }),
            duration: 900,
            ease: "outQuad",
            onComplete: () => {
                animate(".demo-spine-item", {
                    translateY: (_el: any, i: number) => (i % 2 === 0 ? [-3, 3] : [3, -3]),
                    duration: 3600,
                    delay: stagger(140),
                    loop: true,
                    direction: "alternate",
                    ease: "inOutSine"
                });
            }
        });

        return () => {
            anim.pause();
        };
    }, []);

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
                            className="relative demo-spine-item opacity-0"
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
                                className={`cursor-pointer group relative w-10 sm:w-12 ${book.spineBg} ${book.textColor} rounded-sm shadow-xl transition-all duration-300 flex flex-col justify-between p-2 select-none border-t border-l border-white/80 overflow-hidden ${isMatch
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
                                                    {book.coverImage && !imgErrors[book.id] ? (
                                                        <img
                                                            src={book.coverImage}
                                                            alt={book.title}
                                                            onError={() => setImgErrors((prev) => ({ ...prev, [book.id]: true }))}
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
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-semibold ${book.status === "Finished"
                                                        ? "bg-[#dbeafe] text-[#1e40af]"
                                                        : book.status === "Reading"
                                                            ? "bg-[#dcfce7] text-[#166534]"
                                                            : "bg-[#f3e8ff] text-[#6b21a8]"
                                                    }`}>
                                                    <span className={`w-2 h-2 rounded-full ${book.status === "Finished"
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
