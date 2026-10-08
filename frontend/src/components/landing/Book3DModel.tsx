import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { EditorialBook } from "../../constants/editorialBooks";

interface AnimationPreset {
    y: number[];
    rotateY: number[];
    rotateX: number[];
    rotateZ: number[];
    yDuration: number;
    rotateYDuration: number;
    rotateXDuration: number;
    rotateZDuration: number;
    gleamDuration: number;
    gleamDelay: number;
}

// 6 handcrafted distinct 3D animation archetypes
const ANIMATION_PRESETS: AnimationPreset[] = [
    // 0: Deep Spine & Paper Showcase (memperlihatkan punggung emas dan tebalnya lembaran)
    {
        y: [0, -8, 0],
        rotateY: [-31, -18, -31],
        rotateX: [9, 14, 9],
        rotateZ: [-3, 0, -3],
        yDuration: 4.6,
        rotateYDuration: 5.2,
        rotateXDuration: 4.8,
        rotateZDuration: 4.4,
        gleamDuration: 2.0,
        gleamDelay: 2.5
    },
    // 1: Front Cover Spotlight (lebih menghadap ke depan, cover depan terlihat sangat jelas & tenang)
    {
        y: [0, -10, 0],
        rotateY: [-19, -11, -19],
        rotateX: [7, 12, 7],
        rotateZ: [-1, 1.5, -1],
        yDuration: 4.0,
        rotateYDuration: 4.6,
        rotateXDuration: 4.2,
        rotateZDuration: 3.9,
        gleamDuration: 2.4,
        gleamDelay: 3.2
    },
    // 2: Dynamic Multi-Axis Sway (ayunan 3D melingkar yang hidup dan dinamis)
    {
        y: [-1, -11, 2, -1],
        rotateY: [-26, -14, -28, -26],
        rotateX: [13, 8, 15, 13],
        rotateZ: [-4, 1, -2, -4],
        yDuration: 5.2,
        rotateYDuration: 5.8,
        rotateXDuration: 5.0,
        rotateZDuration: 4.6,
        gleamDuration: 2.2,
        gleamDelay: 2.2
    },
    // 3: High Floating Drift (melayang lebih tinggi di udara dengan efek gravitasi ringan)
    {
        y: [0, -13, 0],
        rotateY: [-24, -16, -24],
        rotateX: [11, 16, 11],
        rotateZ: [-2, -4, -2],
        yDuration: 4.3,
        rotateYDuration: 4.9,
        rotateXDuration: 4.4,
        rotateZDuration: 4.1,
        gleamDuration: 1.8,
        gleamDelay: 2.8
    },
    // 4: Calm Horizon (gerakan lambat, anggun dan menenangkan)
    {
        y: [0, -6, 0],
        rotateY: [-22, -15, -22],
        rotateX: [8, 11, 8],
        rotateZ: [1, -2, 1],
        yDuration: 5.6,
        rotateYDuration: 6.0,
        rotateXDuration: 5.4,
        rotateZDuration: 5.2,
        gleamDuration: 2.6,
        gleamDelay: 3.8
    },
    // 5: Playful Tilt (sedikit miring asimetris dengan rotasi dinamis)
    {
        y: [0, -9, 0],
        rotateY: [-27, -15, -27],
        rotateX: [14, 9, 14],
        rotateZ: [2, -3, 2],
        yDuration: 4.1,
        rotateYDuration: 4.5,
        rotateXDuration: 4.2,
        rotateZDuration: 3.8,
        gleamDuration: 2.1,
        gleamDelay: 2.0
    }
];

interface Book3DModelProps {
    book: EditorialBook;
    width?: number;
    height?: number;
    depth?: number;
    imgErrors?: Record<string, boolean>;
    setImgErrors?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    floatingAnimation?: boolean;
    showShadow?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
}

export default function Book3DModel({
    book,
    width = 172,
    height = 250,
    depth = 32,
    imgErrors = {},
    setImgErrors,
    floatingAnimation = true,
    showShadow = true,
    onClick,
    className = ""
}: Book3DModelProps) {
    const bookW = width;
    const bookH = height;
    const bookD = depth;

    // Menghasilkan profil animasi 3D acak & unik per buku/interaksi
    const animProfile = useMemo(() => {
        const seed = book.id ? book.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
        const randomOffset = Math.floor(Math.random() * ANIMATION_PRESETS.length);
        const preset = ANIMATION_PRESETS[(seed + randomOffset) % ANIMATION_PRESETS.length];

        // Variasi mikro (jitter +/- 0.2 detik) agar ritme animasi setiap buku tidak monoton
        const jitter = (Math.random() - 0.5) * 0.4;
        return {
            ...preset,
            yDuration: Math.max(2.6, Number((preset.yDuration + jitter).toFixed(2))),
            rotateYDuration: Math.max(3.0, Number((preset.rotateYDuration + jitter).toFixed(2))),
            rotateXDuration: Math.max(2.8, Number((preset.rotateXDuration + jitter).toFixed(2))),
            rotateZDuration: Math.max(2.5, Number((preset.rotateZDuration + jitter).toFixed(2))),
        };
    }, [book.id]);

    return (
        <div className={`relative flex flex-col items-center select-none ${className}`}>
            {/* ── 3D HARDCOVER BOOK BODY ── */}
            <motion.div
                animate={
                    floatingAnimation
                        ? {
                              y: animProfile.y,
                              rotateY: animProfile.rotateY,
                              rotateX: animProfile.rotateX,
                              rotateZ: animProfile.rotateZ
                          }
                        : {
                              rotateY: animProfile.rotateY[0] || -22,
                              rotateX: animProfile.rotateX[0] || 11,
                              rotateZ: animProfile.rotateZ[0] || -1.5
                          }
                }
                transition={
                    floatingAnimation
                        ? {
                              y: { repeat: Infinity, duration: animProfile.yDuration, ease: "easeInOut" },
                              rotateY: { repeat: Infinity, duration: animProfile.rotateYDuration, ease: "easeInOut" },
                              rotateX: { repeat: Infinity, duration: animProfile.rotateXDuration, ease: "easeInOut" },
                              rotateZ: { repeat: Infinity, duration: animProfile.rotateZDuration, ease: "easeInOut" }
                          }
                        : undefined
                }
                whileHover={{ scale: 1.04, rotateY: -15, rotateX: 7 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className="cursor-pointer relative select-none"
                style={{
                    width: bookW,
                    height: bookH,
                    transformStyle: "preserve-3d"
                }}
            >
                {/* ── 1. FRONT COVER (+Z) ── */}
                <div
                    className="absolute inset-0 rounded-r-sm overflow-hidden bg-cover bg-center border-r border-t border-b border-white/25 shadow-2xl"
                    style={{
                        transform: `translateZ(${bookD / 2}px)`,
                        backfaceVisibility: "hidden",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.35)"
                    }}
                >
                    <div className={`w-full h-full bg-gradient-to-tr ${book.coverGradient} relative overflow-hidden flex flex-col justify-between`}>
                        {/* Cover Image */}
                        {book.coverImage && !imgErrors[book.id] ? (
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                onError={() => setImgErrors && setImgErrors((prev) => ({ ...prev, [book.id]: true }))}
                                className="absolute inset-0 w-full h-full object-cover z-0"
                            />
                        ) : (
                            <div className="my-auto text-center p-3 relative z-10">
                                <h4 className="font-serif font-bold text-sm text-white drop-shadow-md">{book.title}</h4>
                                <p className="text-[10px] font-serif italic text-white/90 mt-1">{book.author}</p>
                            </div>
                        )}

                        {/* Hardcover Spine Hinge Crease / Joint */}
                        <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-black/40 shadow-[1px_0_2px_rgba(255,255,255,0.25)] pointer-events-none z-20" />
                        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/45 via-black/15 to-transparent pointer-events-none z-20" />

                        {/* Dynamic Specular Foil Light Gleam */}
                        <motion.div
                            animate={{ x: ["-130%", "220%"], opacity: [0, 0.45, 0] }}
                            transition={{ duration: animProfile.gleamDuration, repeat: Infinity, repeatDelay: animProfile.gleamDelay, ease: "easeInOut" }}
                            className="absolute inset-0 w-3/5 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none z-20"
                        />

                        {/* Corner bevel highlight on the open edge */}
                        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/40 pointer-events-none z-20" />
                    </div>
                </div>

                {/* ── 2. BOOK SPINE (LEFT FACE, -X) ── */}
                <div
                    className="absolute flex flex-col justify-between items-center py-3 overflow-hidden shadow-inner border-y border-l border-white/20"
                    style={{
                        width: `${bookD}px`,
                        height: `${bookH}px`,
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) rotateY(-90deg) translateZ(${bookW / 2}px)`,
                        backgroundColor: book.c0 || "#0f172a",
                        backfaceVisibility: "hidden"
                    }}
                >
                    {/* Top Starlight Foil Accent Stripe */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#ffd166] to-transparent shrink-0 opacity-85" />

                    {/* Vertical Spine Title */}
                    <div className="flex-1 flex flex-col items-center justify-center overflow-hidden my-1">
                        <span
                            className="text-[9px] font-serif font-bold text-white/95 uppercase tracking-widest block truncate max-h-[145px]"
                            style={{
                                writingMode: "vertical-rl",
                                transform: "rotate(180deg)"
                            }}
                        >
                            {book.shortTitle || book.title}
                        </span>
                    </div>

                    {/* Bottom Starlight Foil Accent Stripe */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#ffd166] to-transparent shrink-0 opacity-85" />
                </div>

                {/* ── 3. BOOK PAGES BLOCK (RIGHT FACE, +X) ── */}
                <div
                    className="absolute rounded-r-xs overflow-hidden"
                    style={{
                        width: `${bookD - 4}px`, // recessed for hardcover overhang lip
                        height: `${bookH - 8}px`, // recessed top and bottom
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${bookW / 2 - 3}px)`,
                        background: "repeating-linear-gradient(to bottom, #fcf9f2 0px, #f4eee2 2px, #e7dcce 3px, #fcf9f2 4px)",
                        boxShadow: "inset 4px 0 8px rgba(0,0,0,0.22), inset -4px 0 8px rgba(0,0,0,0.2)",
                        backfaceVisibility: "hidden"
                    }}
                />

                {/* ── 4. TOP PAGES FACE (UP, -Y) ── */}
                <div
                    className="absolute"
                    style={{
                        width: `${bookW - 8}px`,
                        height: `${bookD - 4}px`,
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${bookH / 2 - 3}px)`,
                        background: "repeating-linear-gradient(to right, #fcf9f2 0px, #f4eee2 2px, #e7dcce 3px, #fcf9f2 4px)",
                        boxShadow: "inset 0 3px 6px rgba(0,0,0,0.2), inset 0 -3px 6px rgba(0,0,0,0.18)",
                        backfaceVisibility: "hidden"
                    }}
                />

                {/* ── 5. BOTTOM PAGES FACE (DOWN, +Y) ── */}
                <div
                    className="absolute"
                    style={{
                        width: `${bookW - 8}px`,
                        height: `${bookD - 4}px`,
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${bookH / 2 - 3}px)`,
                        background: "repeating-linear-gradient(to right, #fcf9f2 0px, #f4eee2 2px, #e7dcce 3px, #fcf9f2 4px)",
                        boxShadow: "inset 0 4px 8px rgba(0,0,0,0.28)",
                        backfaceVisibility: "hidden"
                    }}
                />

                {/* ── 6. BACK COVER (-Z) ── */}
                <div
                    className="absolute rounded-l-sm overflow-hidden flex flex-col justify-between p-2.5 border-l border-t border-b border-white/10"
                    style={{
                        width: `${bookW}px`,
                        height: `${bookH}px`,
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) rotateY(180deg) translateZ(${bookD / 2}px)`,
                        backgroundColor: book.c0 || "#2c1d11",
                        boxShadow: "0 0 16px rgba(0,0,0,0.45)",
                        backfaceVisibility: "hidden"
                    }}
                >
                    <div className={`w-full h-full bg-gradient-to-tr ${book.coverGradient} opacity-95 p-2 flex flex-col justify-between text-white/80 rounded-xs`}>
                        <div className="h-1 w-12 bg-[#ffd166]/60 mx-auto rounded-full mt-2" />
                        <p className="text-[8.5px] font-serif italic text-center line-clamp-3 opacity-75 px-1">
                            "{book.personalQuote || book.title}"
                        </p>
                        <div className="flex items-center justify-between text-[7px] font-mono opacity-50 px-1 border-t border-white/15 pt-1">
                            <span>ISBN {book.year}</span>
                            <span>{book.pages} pp</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── 3D FLOOR / CONTACT PERSPECTIVE SHADOW ── */}
            {showShadow && (
                <motion.div
                    animate={
                        floatingAnimation
                            ? {
                                  scale: [1, 1.14, 1],
                                  opacity: [0.55, 0.3, 0.55],
                                  x: [0, 2, 0]
                              }
                            : undefined
                    }
                    transition={
                        floatingAnimation
                            ? { repeat: Infinity, duration: animProfile.yDuration, ease: "easeInOut" }
                            : undefined
                    }
                    className="w-[150px] h-[15px] bg-black/60 rounded-full blur-md mx-auto mt-2 pointer-events-none"
                    style={{
                        transform: "rotateX(75deg)"
                    }}
                />
            )}
        </div>
    );
}
