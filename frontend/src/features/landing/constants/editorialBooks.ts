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
    synopsisEn?: string;
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
        category: "SELF-HELP",
        language: "Bahasa Indonesia",
        pages: 160,
        year: 2020,
        status: "Finished",
        coverGradient: "from-[#1b4332] via-[#2d6a4f] to-[#081c15]",
        coverImage: "/covers/berdamai-dengan-diri-sendiri.jpg",
        synopsis: "Buku pengembangan diri yang hangat ini mengajak pembaca menyelami seni berdamai dengan ketidaksempurnaan, menghentikan kritik internal yang melelahkan, dan melepaskan standar semu orang lain. Ditulis dengan pendekatan reflektif, pembaca dibimbing untuk memeluk luka masa lalu dan menemukan kedamaian sejati dengan mencintai diri sendiri apa adanya.",
        synopsisEn: "This compassionate self-help guide invites readers to embrace their flaws, quiet relentless inner criticism, and release the burden of external expectations. Written with thoughtful reflection, it guides you to heal past vulnerabilities and discover genuine peace by whole-heartedly accepting who you are.",
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
        synopsis: "Memoar legendaris psikiater Viktor Frankl yang merefleksikan ketahanan jiwa manusia di tengah kengerian kamp konsentrasi Nazi Auschwitz. Dari penderitaan yang tak terbayangkan, Frankl merumuskan Logoterapi—prinsip revolusioner bahwa dorongan terdalam manusia bukanlah mengejar kesenangan atau kekuasaan, melainkan menemukan makna hidup di segala keadaan.",
        synopsisEn: "The legendary memoir of psychiatrist Viktor Frankl reflecting on the endurance of the human spirit amidst the horrors of Nazi concentration camps. From unimaginable suffering, Frankl pioneered Logotherapy—the profound principle that humanity's deepest motivation is neither pleasure nor power, but the quest for purpose and meaning in every circumstance.",
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
        synopsis: "Mahakarya distopia klasik George Orwell yang menggambarkan dunia kelam di bawah cengkeraman rezim totalitarian Partai dan pengawasan abadi Big Brother. Melalui kisah perjuangan Winston Smith dalam mempertahankan kesadaran dan kebenaran, novel ini menjadi peringatan abadi tentang bahaya manipulasi bahasa, propaganda historis, dan pengawasan mutlak.",
        synopsisEn: "George Orwell's classic dystopian masterpiece paints a chilling portrait of a society held in the absolute grip of the totalitarian Party and the watchful eye of Big Brother. Following Winston Smith's clandestine rebellion to preserve his thoughts and humanity, this novel stands as an enduring warning against thought control, propaganda, and surveillance.",
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
        synopsis: "Sebuah novel perjalanan emosional karya Tere Liye yang mengisahkan tiga santri yang diutus mengarungi pelosok Nusantara untuk melacak jejak Bahar, seorang alumni bermasalah dengan masa lalu kelam. Menyelami lika-liku kehidupan, pertobatan, dan persahabatan, kisah ini mengupas tuntas bahwa setiap janji memiliki takdir dan konsekuensi yang harus ditepati.",
        synopsisEn: "An evocative journey novel by Tere Liye that follows three students sent across the Indonesian archipelago to trace the footsteps of Bahar, an elusive soul with a turbulent past. Exploring life's unexpected twists, redemption, and deep bonds, this heartfelt tale reveals how every solemn promise carries a destiny that must eventually be fulfilled.",
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
        synopsis: "Kisah romansa urban yang syahdu berlatar kehangatan sudut-sudut kota Yogyakarta di keheningan tengah malam. Mengangkat dinamika hubungan antara Serana dan Malioboro, novel ini menyajikan narasi manis sekaligus getir tentang kesempatan kedua, menyembuhkan trauma hubungan masa lalu, dan menemukan rumah di dalam diri orang lain.",
        synopsisEn: "A gentle, atmospheric urban romance set against the midnight glow and tranquil streets of Yogyakarta. Chronicling the tender bond between Serana and Malioboro, this story explores second chances, the gradual healing of past emotional wounds, and the comforting revelation of finding a true home in someone else.",
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
        synopsis: "Sebuah memoar yang mengharukan tentang reuni antara jurnalis Mitch Albom dan mantan profesor sosiologinya, Morrie Schwartz, yang tengah berjuang menghadapi penyakit terminal ALS. Pertemuan rutin setiap hari Selasa menjadi kelas kehidupan terakhir yang mendalam tentang cinta, memaafkan, penerimaan usia, dan esensi hidup bahagia.",
        synopsisEn: "A poignant memoir capturing the reunion between busy journalist Mitch Albom and his college sociology professor Morrie Schwartz, who is living with terminal ALS. Their regular Tuesday visits turn into an intimate masterclass on living, offering timeless wisdom on giving love, forgiving regrets, and embracing the beauty of human vulnerability.",
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
        synopsis: "Sebuah panduan psikologi Adlerian yang mencerahkan tentang seni melepaskan beban ekspektasi sosial, memisahkan tugas pribadi dengan urusan orang lain, dan berani hidup tanpa rasa takut akan penolakan. Disajikan lewat dialog filosofis yang kaya, buku ini membekali pembaca dengan keberanian untuk mencintai diri sendiri dan memilih kebahagiaan saat ini juga.",
        synopsisEn: "An illuminating Adlerian psychology guide exploring the art of shedding societal expectations, separating personal tasks from interpersonal judgment, and living free from the dread of rejection. Framed as an insightful philosophical dialogue, it empowers readers with the genuine courage to accept themselves and choose happiness in the present moment.",
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
        synopsis: "Novel historis karya Leila S. Chudori yang mengangkat tragedi kelam penghilangan paksa para aktivis mahasiswa masa Orde Baru tahun 1998. Terbagi dalam dua babak yang menyayat hati—sudut pandang Laut yang disekap dalam ruang interogasi gelap dan keluarganya yang setia menunggu tanpa kepastian—karya ini adalah monumen pengingat agar sejarah tak dilupakan.",
        synopsisEn: "A powerful historical novel by Leila S. Chudori shedding light on the forced disappearances of student activists during Indonesia's 1998 New Order regime. Told in two heart-wrenching perspectives—Laut, trapped in a clandestine detention room, and his family left in painful limbo—this novel stands as an unforgettable tribute to memory, truth, and resilience.",
        personalQuote: "Matilah engkau mati, kau akan lahir berkali-kali.",
        rating: 5.0,
        tiltDegree: 0,
        heightPx: 335,
        spineBg: "bg-[#173d6b]",
        textColor: "text-[#e0edfd]",
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
        synopsis: "Kombinasi memoar pribadi yang jujur dan wawasan psikiatri tentang bagaimana manusia memproses duka, kehilangan mendalam, dan rasa hampa. Melalui metafora sederhana mencuci piring, dr. Andreas mengajak kita memahami bahwa pemulihan jiwa tidak memerlukan lompatan besar, melainkan penerimaan pelan-pelan melalui ritme kecil kehidupan sehari-hari.",
        synopsisEn: "An intimate blend of heartfelt memoir and psychiatric wisdom exploring how we process profound grief, unexpected loss, and emotional emptiness. Through the grounded metaphor of washing dishes, dr. Andreas illustrates that healing rarely requires grand gestures, but rather patient acceptance through life's small daily rhythms.",
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
        synopsis: "Fabel puitis abadi tentang seorang pangeran cilik yang bertualang meninggalkan asteroid kecilnya untuk menjelajahi berbagai planet hingga mendarat di Bumi. Melalui perjumpaan dengan bunga mawar, rubah bijak, dan seorang penerbang yang terdampar di gurun, kisah ini menuturkan rahasia hidup paling hakiki: hal terpenting hanya bisa dilihat dengan hati, sebab yang esensial tidak tampak oleh mata.",
        synopsisEn: "A timeless, poetic fable following a young prince who journeys across eccentric planets before landing in the Sahara Desert. Through his touching encounters with his cherished rose, a wise fox, and a stranded aviator, this story whispers life's most enduring truth: that what is essential can only be seen with the heart, for it is invisible to the eye.",
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
