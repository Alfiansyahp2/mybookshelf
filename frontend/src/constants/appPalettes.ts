import type { CSSProperties } from "react";

export type LightPaletteId = "parchment" | "sage" | "slate" | "rosewood";
export type DarkPaletteId = "espresso" | "midnight" | "forest" | "plum";

export type AppThemeVars = CSSProperties & Record<`--${string}`, string>;

export interface AppPaletteDefinition<TId extends string> {
    id: TId;
    nameKey: string;
    defaultName: string;
    descKey: string;
    defaultDesc: string;
    swatches: [string, string, string, string];
    cssVars: AppThemeVars;
}

export const LIGHT_PALETTES: readonly AppPaletteDefinition<LightPaletteId>[] =
    [
        {
            id: "parchment",
            nameKey: "settings.palettes.light.parchment.name",
            defaultName: "Perkamen Hangat",
            descKey: "settings.palettes.light.parchment.desc",
            defaultDesc: "Krem klasik, kayu walnut, dan emas",
            swatches: ["#e2c99a", "#fcfaf7", "#7a5c42", "#d4a574"],
            cssVars: {
                "--color-cream": "#f8f5f0",
                "--color-cream-rgb": "248 245 240",
                "--color-dark-brown": "#4a3b2f",
                "--color-dark-brown-rgb": "74 59 47",
                "--color-walnut": "#7a5c42",
                "--color-walnut-rgb": "122 92 66",
                "--color-gold": "#d4a574",
                "--color-gold-rgb": "212 165 116",
                "--color-beige": "#e8e0d5",
                "--color-beige-rgb": "232 224 213",
                "--app-surface-rgb": "252 250 247",
                "--app-surface-alt-rgb": "248 245 240",
                "--app-ink-rgb": "74 59 47",
                "--app-canvas-bg": "#f8f5f0",
                "--app-wall-bg":
                    "linear-gradient(150deg, #e2c99a 0%, #cdb07c 45%, #b89860 100%)",
                "--app-banner-bg":
                    "linear-gradient(135deg, #5c3a1e 0%, #4a2e16 50%, #3a2210 100%)",
                "--app-header-scrolled-bg": "rgba(255, 255, 255, 0.95)",
            },
        },
        {
            id: "sage",
            nameKey: "settings.palettes.light.sage.name",
            defaultName: "Zaitun Botani",
            descKey: "settings.palettes.light.sage.desc",
            defaultDesc: "Kertas sage menenangkan & kuningan",
            swatches: ["#d2dec9", "#fafcf8", "#4b634e", "#c9a86c"],
            cssVars: {
                "--color-cream": "#f4f7f2",
                "--color-cream-rgb": "244 247 242",
                "--color-dark-brown": "#263628",
                "--color-dark-brown-rgb": "38 54 40",
                "--color-walnut": "#4b634e",
                "--color-walnut-rgb": "75 99 78",
                "--color-gold": "#c9a86c",
                "--color-gold-rgb": "201 168 108",
                "--color-beige": "#e0e8db",
                "--color-beige-rgb": "224 232 219",
                "--app-surface-rgb": "250 252 248",
                "--app-surface-alt-rgb": "242 246 239",
                "--app-ink-rgb": "38 54 40",
                "--app-canvas-bg": "#f4f7f2",
                "--app-wall-bg":
                    "linear-gradient(150deg, #dce5d5 0%, #c4d3ba 48%, #acbf9f 100%)",
                "--app-banner-bg":
                    "linear-gradient(135deg, #354b38 0%, #2a3c2d 50%, #1f2e21 100%)",
                "--app-header-scrolled-bg": "rgba(249, 252, 247, 0.95)",
            },
        },
        {
            id: "slate",
            nameKey: "settings.palettes.light.slate.name",
            defaultName: "Arsip Tinta",
            descKey: "settings.palettes.light.slate.desc",
            defaultDesc: "Ivory bersih, biru arsip, & oker",
            swatches: ["#ccd7e6", "#fafbfd", "#445a75", "#c89b54"],
            cssVars: {
                "--color-cream": "#f4f6f9",
                "--color-cream-rgb": "244 246 249",
                "--color-dark-brown": "#1f2937",
                "--color-dark-brown-rgb": "31 41 55",
                "--color-walnut": "#445a75",
                "--color-walnut-rgb": "68 90 117",
                "--color-gold": "#c89b54",
                "--color-gold-rgb": "200 155 84",
                "--color-beige": "#dee4ed",
                "--color-beige-rgb": "222 228 237",
                "--app-surface-rgb": "250 251 253",
                "--app-surface-alt-rgb": "241 244 249",
                "--app-ink-rgb": "31 41 55",
                "--app-canvas-bg": "#f4f6f9",
                "--app-wall-bg":
                    "linear-gradient(150deg, #dde4ee 0%, #c6d2e2 48%, #aebed4 100%)",
                "--app-banner-bg":
                    "linear-gradient(135deg, #2d3e53 0%, #223041 50%, #192432 100%)",
                "--app-header-scrolled-bg": "rgba(250, 252, 255, 0.95)",
            },
        },
        {
            id: "rosewood",
            nameKey: "settings.palettes.light.rosewood.name",
            defaultName: "Terakota Linen",
            descKey: "settings.palettes.light.rosewood.desc",
            defaultDesc: "Nuansa mawar lembut & tembaga",
            swatches: ["#e3c0b6", "#fdf9f8", "#844d47", "#d49a6a"],
            cssVars: {
                "--color-cream": "#fbf4f2",
                "--color-cream-rgb": "251 244 242",
                "--color-dark-brown": "#452421",
                "--color-dark-brown-rgb": "69 36 33",
                "--color-walnut": "#844d47",
                "--color-walnut-rgb": "132 77 71",
                "--color-gold": "#d49a6a",
                "--color-gold-rgb": "212 154 106",
                "--color-beige": "#f0dfda",
                "--color-beige-rgb": "240 223 218",
                "--app-surface-rgb": "253 249 248",
                "--app-surface-alt-rgb": "248 238 235",
                "--app-ink-rgb": "69 36 33",
                "--app-canvas-bg": "#fbf4f2",
                "--app-wall-bg":
                    "linear-gradient(150deg, #ead1ca 0%, #d8b3a8 48%, #c4978b 100%)",
                "--app-banner-bg":
                    "linear-gradient(135deg, #5d302c 0%, #4b2421 50%, #3a1a18 100%)",
                "--app-header-scrolled-bg": "rgba(253, 249, 248, 0.95)",
            },
        },
    ];

export const DARK_PALETTES: readonly AppPaletteDefinition<DarkPaletteId>[] = [
    {
        id: "espresso",
        nameKey: "settings.palettes.dark.espresso.name",
        defaultName: "Espresso Kayu",
        descKey: "settings.palettes.dark.espresso.desc",
        defaultDesc: "Cokelat malam hangat & emas amber",
        swatches: ["#1a130d", "#2c2017", "#9a6e44", "#deb276"],
        cssVars: {
            "--color-cream": "#f5ede2",
            "--color-cream-rgb": "245 237 226",
            "--color-dark-brown": "#3a291c",
            "--color-dark-brown-rgb": "58 41 28",
            "--color-walnut": "#9a6e44",
            "--color-walnut-rgb": "154 110 68",
            "--color-gold": "#deb276",
            "--color-gold-rgb": "222 178 118",
            "--color-beige": "#2c2118",
            "--color-beige-rgb": "44 33 24",
            "--app-surface-rgb": "35 27 20",
            "--app-surface-alt-rgb": "26 19 13",
            "--app-ink-rgb": "245 237 226",
            "--app-canvas-bg": "#1a130d",
            "--app-wall-bg":
                "linear-gradient(150deg, #211810 0%, #19120c 48%, #120c08 100%)",
            "--app-banner-bg":
                "linear-gradient(135deg, #3d2614 0%, #2e1c0e 50%, #221409 100%)",
            "--app-header-scrolled-bg": "rgba(34, 24, 16, 0.92)",
        },
    },
    {
        id: "midnight",
        nameKey: "settings.palettes.dark.midnight.name",
        defaultName: "Biru Larut Malam",
        descKey: "settings.palettes.dark.midnight.desc",
        defaultDesc: "Navy dalam & aksen emas lembut",
        swatches: ["#0c1220", "#162035", "#6680b0", "#eab65d"],
        cssVars: {
            "--color-cream": "#eef3fa",
            "--color-cream-rgb": "238 243 250",
            "--color-dark-brown": "#1e2a42",
            "--color-dark-brown-rgb": "30 42 66",
            "--color-walnut": "#6680b0",
            "--color-walnut-rgb": "102 128 176",
            "--color-gold": "#eab65d",
            "--color-gold-rgb": "234 182 93",
            "--color-beige": "#182236",
            "--color-beige-rgb": "24 34 54",
            "--app-surface-rgb": "21 30 50",
            "--app-surface-alt-rgb": "14 21 37",
            "--app-ink-rgb": "238 243 250",
            "--app-canvas-bg": "#0c1220",
            "--app-wall-bg":
                "linear-gradient(150deg, #121a2d 0%, #0d1424 50%, #080d18 100%)",
            "--app-banner-bg":
                "linear-gradient(135deg, #1d2b49 0%, #162038 50%, #101729 100%)",
            "--app-header-scrolled-bg": "rgba(15, 22, 38, 0.92)",
        },
    },
    {
        id: "forest",
        nameKey: "settings.palettes.dark.forest.name",
        defaultName: "Hutan Pinus",
        descKey: "settings.palettes.dark.forest.desc",
        defaultDesc: "Ruang baca hijau gelap & kuningan",
        swatches: ["#101a14", "#1b2b21", "#5c8468", "#d4b46c"],
        cssVars: {
            "--color-cream": "#edf3ec",
            "--color-cream-rgb": "237 243 236",
            "--color-dark-brown": "#213428",
            "--color-dark-brown-rgb": "33 52 40",
            "--color-walnut": "#5c8468",
            "--color-walnut-rgb": "92 132 104",
            "--color-gold": "#d4b46c",
            "--color-gold-rgb": "212 180 108",
            "--color-beige": "#1b2b21",
            "--color-beige-rgb": "27 43 33",
            "--app-surface-rgb": "25 39 30",
            "--app-surface-alt-rgb": "17 28 21",
            "--app-ink-rgb": "237 243 236",
            "--app-canvas-bg": "#101a14",
            "--app-wall-bg":
                "linear-gradient(150deg, #17241c 0%, #111c15 50%, #0b130e 100%)",
            "--app-banner-bg":
                "linear-gradient(135deg, #213729 0%, #182a1e 50%, #111e16 100%)",
            "--app-header-scrolled-bg": "rgba(18, 29, 22, 0.92)",
        },
    },
    {
        id: "plum",
        nameKey: "settings.palettes.dark.plum.name",
        defaultName: "Velvet Tembaga",
        descKey: "settings.palettes.dark.plum.desc",
        defaultDesc: "Arang hangat & sentuhan tembaga",
        swatches: ["#161217", "#261f28", "#9c6c7a", "#df9a72"],
        cssVars: {
            "--color-cream": "#f4edf2",
            "--color-cream-rgb": "244 237 242",
            "--color-dark-brown": "#302632",
            "--color-dark-brown-rgb": "48 38 50",
            "--color-walnut": "#9c6c7a",
            "--color-walnut-rgb": "156 108 122",
            "--color-gold": "#df9a72",
            "--color-gold-rgb": "223 154 114",
            "--color-beige": "#261f28",
            "--color-beige-rgb": "38 31 40",
            "--app-surface-rgb": "36 29 38",
            "--app-surface-alt-rgb": "25 20 27",
            "--app-ink-rgb": "244 237 242",
            "--app-canvas-bg": "#161217",
            "--app-wall-bg":
                "linear-gradient(150deg, #211a23 0%, #18131a 50%, #100c12 100%)",
            "--app-banner-bg":
                "linear-gradient(135deg, #3a2a36 0%, #2d2029 50%, #22171f 100%)",
            "--app-header-scrolled-bg": "rgba(26, 20, 28, 0.92)",
        },
    },
];

export function getLightPalette(id: LightPaletteId) {
    return (
        LIGHT_PALETTES.find((palette) => palette.id === id) ??
        LIGHT_PALETTES[0]
    );
}

export function getDarkPalette(id: DarkPaletteId) {
    return (
        DARK_PALETTES.find((palette) => palette.id === id) ?? DARK_PALETTES[0]
    );
}

export function getAppPaletteVars(
    isDarkMode: boolean,
    lightPaletteId: LightPaletteId,
    darkPaletteId: DarkPaletteId,
): AppThemeVars {
    return isDarkMode
        ? getDarkPalette(darkPaletteId).cssVars
        : getLightPalette(lightPaletteId).cssVars;
}
