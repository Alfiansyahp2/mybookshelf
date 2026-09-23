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

export interface MobileBookStyle {
    height: number;
    tilt: number;
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
        tiltDegree: 0,
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
        tiltDegree: -2.6,
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
        tiltDegree: 0,
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
        tiltDegree: 2.4,
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
        tiltDegree: 0,
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
        tiltDegree: -2.2,
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
        tiltDegree: 0,
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
        tiltDegree: 0,
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
        tiltDegree: 2.6,
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
        tiltDegree: 0,
        heightPx: 295,
        spineBg: "bg-[#1e3a8a]",
        textColor: "text-[#fef08a]",
        c0: "#172554",
        c1: "#1e3a8a",
        c2: "#facc15"
    }
];

// Natural bookshelf rhythm: stable upright book clusters with gentle organic slants (2.2° - 2.6°) leaning against taller neighbors
export const MOBILE_BOOK_STYLES: MobileBookStyle[] = [
    { height: 310, tilt: 0 },    // 0: Berdamai (Muthia) - tegak kokoh
    { height: 275, tilt: -2.6 }, // 1: Man's Search (Viktor) - miring lembut ke kiri menyandar ke Muthia
    { height: 330, tilt: 0 },    // 2: 1984 (George) - buku tinggi kokoh, tegak lurus
    { height: 285, tilt: 2.4 },  // 3: Janji (Tere) - miring lembut ke kanan menyandar ke Malioboro
    { height: 320, tilt: 0 },    // 4: Malioboro (Skysphire) - pilar tegak di tengah
    { height: 290, tilt: -2.2 }, // 5: Tuesdays with Morrie (Mitch) - miring lembut ke kiri menyandar ke Malioboro
    { height: 310, tilt: 0 },    // 6: Courage (Ichiro) - tegak lurus
    { height: 330, tilt: 0 },    // 7: Laut Bercerita (Leila) - tegak lurus
    { height: 270, tilt: 2.6 },  // 8: Seorang Pria (dr. Andreas) - miring lembut ke kanan menyandar ke Little Prince
    { height: 315, tilt: 0 }     // 9: The Little Prince (Antoine) - tegak lurus
];
