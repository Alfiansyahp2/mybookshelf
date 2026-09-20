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
        coverGradient: "from-[#1b4332] via-[#2d6a4f] to-[#081c15]",
        coverImage: "/covers/berdamai-dengan-diri-sendiri.jpg",
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
        title: "Seorang Pria yang Melalui Duka dengan Mencuci Piring",
        shortTitle: "SEORANG PRIA YANG MELALUI DUKA DENGAN MENCUCI PIRING",
        author: "dr. Andreas Kurniawan, Sp.KJ",
        category: "PSYCHOLOGY, SELF-HELP, MEMOIR",
        language: "Bahasa Indonesia",
        pages: 248,
        year: 2024,
        status: "Finished",
        coverGradient: "from-[#f97316] via-[#ea580c] to-[#7c2d12]",
        coverImage: "/covers/seorang-pria-yang-melalui-duka-dengan-mencuci-piring.jpg",
        synopsis: "Sebuah panduan psikologi dan memoar reflektif tentang duka, kehilangan, serta proses penyembuhan diri melalui tindakan-tindakan sederhana sehari-hari seperti mencuci piring.",
        personalQuote: "Duka tidak harus diselesaikan sekaligus; kadang ia hanya butuh diterima satu piring bersih demi satu piring bersih.",
        rating: 5.0,
        tiltDegree: 2,
        heightPx: 310,
        spineBg: "bg-[#fed7aa]",
        textColor: "text-[#7c2d12]",
        c0: "#ea580c",
        c1: "#f97316",
        c2: "#fed7aa"
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
    const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);
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

    const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);

    const handleMobileTouchStart = (e: React.TouchEvent) => {
        setTouchStartPos({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
    };

    const handleMobileTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartPos) return;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const diffX = touchStartPos.x - endX;
        const diffY = touchStartPos.y - endY;

        if (Math.abs(diffX) > 18 || Math.abs(diffY) > 18) {
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    setActiveMobileIndex((prev) => (prev + 1) % books.length);
                } else {
                    setActiveMobileIndex((prev) => (prev - 1 + books.length) % books.length);
                }
            } else {
                if (diffY > 0) {
                    setActiveMobileIndex((prev) => (prev + 1) % books.length);
                } else {
                    setActiveMobileIndex((prev) => (prev - 1 + books.length) % books.length);
                }
            }
        }
        setTouchStartPos(null);
    };

    const [lastWheelTime, setLastWheelTime] = useState(0);

    const handleMobileWheel = (e: React.WheelEvent) => {
        const now = Date.now();
        if (now - lastWheelTime < 280) return;

        if (Math.abs(e.deltaY) > 10 || Math.abs(e.deltaX) > 10) {
            setLastWheelTime(now);
            if (e.deltaY > 0 || e.deltaX > 0) {
                setActiveMobileIndex((prev) => (prev + 1) % books.length);
            } else {
                setActiveMobileIndex((prev) => (prev - 1 + books.length) % books.length);
            }
        }
    };

    return (
        <div className="w-full text-[#4a3b2f] font-sans">
            {/* ── DESKTOP & TABLET STANDING SPINES SHOWCASE ── */}
            <div className="hidden md:flex relative py-6 px-4 flex-wrap items-end justify-center gap-4 min-h-[360px] max-h-[390px]">
                {books.map((book) => {
                    const isStatusMatch = statusFilter === "All" || book.status === statusFilter;
                    const isLangMatch = langFilter === "Semua" || book.language === langFilter;
                    const isMatch = isStatusMatch && isLangMatch;
                    const isHovered = hoveredBookId === book.id;

                    return (
                        <div
                            key={book.id}
                            className={`relative demo-spine-item opacity-0 transition-all ${isHovered ? "z-[9999]" : "z-1"}`}
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
                                className={`cursor-pointer group relative w-12 ${book.spineBg} ${book.textColor} rounded-sm shadow-xl transition-all duration-300 flex flex-col justify-between p-2 select-none border-t border-l border-white/80 overflow-hidden ${isMatch
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
                                        className="font-serif font-bold text-xs tracking-wider uppercase leading-none overflow-hidden max-h-full"
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

                            {/* ── HOVER TOOLTIP POPUP (DESKTOP ONLY) ── */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.94 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.94 }}
                                        transition={{ duration: 0.16, ease: "easeOut" }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[9999] pointer-events-none w-64 shadow-2xl rounded-2xl overflow-hidden border border-[#7a5c42]/20"
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

                                        <div className="p-4">
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
                                                    <h5 className="font-serif font-bold text-sm text-[#1c0f05] leading-snug line-clamp-2">
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

            {/* ── MOBILE STACKED HORIZONTAL SPINES SHOWCASE (TOUCH & WHEEL SCROLLABLE) ── */}
            <div
                onTouchStart={handleMobileTouchStart}
                onTouchEnd={handleMobileTouchEnd}
                onWheel={handleMobileWheel}
                className="flex md:hidden flex-col items-center justify-between w-full py-2 sm:py-4 min-h-[350px] select-none relative touch-pan-y"
            >
                {/* Horizontal Tilted Spine Stack */}
                <div className="w-full flex flex-col items-center justify-center space-y-3 my-auto px-1 sm:px-2">
                    {[-1, 0, 1].map((offset) => {
                        const idx = (activeMobileIndex + offset + books.length) % books.length;
                        const book = books[idx];
                        const isActive = offset === 0;

                        return (
                            <motion.div
                                key={`slot-${offset}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isActive) {
                                        handleSelectBook(book.id);
                                    } else {
                                        setActiveMobileIndex(idx);
                                    }
                                }}
                                animate={{
                                    opacity: isActive ? 1 : 0.5,
                                    scale: isActive ? 1 : 0.92,
                                    filter: isActive ? "blur(0px)" : "blur(0.5px)"
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 240,
                                    damping: 24,
                                    mass: 0.8
                                }}
                                className={`w-full max-w-[360px] rounded-2xl transition-colors duration-300 cursor-pointer flex items-center justify-between shadow-lg relative ${
                                    isActive
                                        ? "p-3 sm:p-3.5 bg-gradient-to-r from-[#fdfbf7] via-[#faf4e8] to-[#f5ecd7] text-[#4a3b2f] border-l-4 border-[#7a5c42] shadow-2xl z-20 ring-1 ring-[#7a5c42]/25"
                                        : "px-4 py-2.5 bg-[#f5ecd7]/80 text-[#7a5c42]/90 z-10 border border-[#7a5c42]/10"
                                }`}
                                style={{
                                    transform: `rotate(${offset === 0 ? -1.5 : offset * 2}deg)`
                                }}
                            >
                                <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.div
                                        key={book.id}
                                        initial={{ opacity: 0, y: offset > 0 ? 8 : -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: offset > 0 ? -8 : 8 }}
                                        transition={{ duration: 0.22, ease: "easeOut" }}
                                        className="flex items-center gap-3 min-w-0 flex-1 w-full"
                                    >
                                        {/* Mini Cover Thumbnail */}
                                        <div className={`${isActive ? "w-11 h-15" : "w-8 h-11"} rounded-md shadow-md overflow-hidden shrink-0 border border-black/15 bg-[#e8deca] relative transition-all duration-300`}>
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

                                        {/* Book Metadata */}
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#7a5c42]/80 truncate">
                                                {book.author}
                                            </span>
                                            <h4 className={`font-serif font-bold text-[#2a1a08] leading-snug truncate ${isActive ? "text-sm sm:text-base" : "text-xs"}`}>
                                                {book.title}
                                            </h4>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Horizontal Pill Dash Scroll Indicator */}
                <div className="flex items-center justify-center gap-[2.5px] pt-3 pb-1 z-30">
                    {books.map((b, idx) => {
                        const isActive = idx === activeMobileIndex;
                        return (
                            <button
                                key={`dash-${b.id}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMobileIndex(idx);
                                }}
                                className="p-0 focus:outline-none flex items-center justify-center min-h-[20px] transition-transform active:scale-90 cursor-pointer"
                                aria-label={`Scroll to item ${idx + 1}`}
                                title={`${idx + 1}. ${b.title}`}
                            >
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: isActive ? 16 : 10,
                                        width: isActive ? 4 : 3,
                                        backgroundColor: isActive ? "#7a5c42" : "rgba(122, 92, 66, 0.25)",
                                        boxShadow: isActive ? "0px 2px 6px rgba(122, 92, 66, 0.35)" : "none"
                                    }}
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                    className="rounded-full"
                                />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
