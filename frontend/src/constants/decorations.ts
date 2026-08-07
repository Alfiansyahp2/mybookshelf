import type { DecorationKind } from "../types/decorations";

// ── Decoration catalogue (label + emoji) ─────────────────
export const DECORATION_CATALOGUE: {
    kind: DecorationKind;
    label: string;
    emoji: string;
    desc: string;
}[] = [
    {
        kind: "candle",
        label: "Lilin",
        emoji: "🕯️",
        desc: "Lilin hangat menyala",
    },
    {
        kind: "candle_pair",
        label: "Duo Lilin",
        emoji: "🕯️🕯️",
        desc: "Dua lilin berdampingan",
    },
    {
        kind: "plant_pot",
        label: "Tanaman Pot",
        emoji: "🪴",
        desc: "Tanaman hijau dalam pot",
    },
    {
        kind: "plant_hanging",
        label: "Tanaman Gantung",
        emoji: "🌿",
        desc: "Tanaman rambat menggantung",
    },
    {
        kind: "succulent",
        label: "Sukulen",
        emoji: "🌵",
        desc: "Kaktus mini lucu",
    },
    {
        kind: "vase_tall",
        label: "Vas Tinggi",
        emoji: "🏺",
        desc: "Vas elegan dengan bunga kering",
    },
    {
        kind: "vase_round",
        label: "Vas Bulat",
        emoji: "⚱️",
        desc: "Vas keramik bulat",
    },
    {
        kind: "frame_photo",
        label: "Bingkai Foto",
        emoji: "🖼️",
        desc: "Foto kenangan kecil",
    },
    {
        kind: "bookend_L",
        label: "Penyangga L",
        emoji: "📐",
        desc: "Penyangga buku kayu",
    },
    {
        kind: "clock_small",
        label: "Jam Meja",
        emoji: "⏱️",
        desc: "Jam meja klasik",
    },
    {
        kind: "clock_digital",
        label: "Jam Digital",
        emoji: "📟",
        desc: "Jam retro menyala",
    },
    {
        kind: "mug",
        label: "Cangkir Kopi",
        emoji: "☕",
        desc: "Kopi hangat mengepul",
    },
    {
        kind: "lantern",
        label: "Lentera",
        emoji: "🏮",
        desc: "Lentera kertas kecil",
    },
    {
        kind: "cat_sleep",
        label: "Kucing Tidur",
        emoji: "🐈",
        desc: "Kucing pixel tidur pulas",
    },
    {
        kind: "cat_sit",
        label: "Kucing Duduk",
        emoji: "🐱",
        desc: "Kucing pixel duduk santai",
    },
];

