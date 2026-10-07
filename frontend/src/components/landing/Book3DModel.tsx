import React from "react";
import { motion } from "framer-motion";
import type { EditorialBook } from "../../constants/editorialBooks";

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

    return (
        <div className={`relative flex flex-col items-center select-none ${className}`}>
            {/* ── 3D HARDCOVER BOOK BODY ── */}
            <motion.div
                animate={
                    floatingAnimation
                        ? {
                              y: [0, -7, 0],
                              rotateY: [-26, -18, -26],
                              rotateX: [10, 13, 10],
                              rotateZ: [-2, -1, -2]
                          }
                        : {
                              rotateY: -22,
                              rotateX: 11,
                              rotateZ: -1.5
                          }
                }
                transition={
                    floatingAnimation
                        ? {
                              y: { repeat: Infinity, duration: 4.2, ease: "easeInOut" },
                              rotateY: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                              rotateX: { repeat: Infinity, duration: 4.6, ease: "easeInOut" },
                              rotateZ: { repeat: Infinity, duration: 4.2, ease: "easeInOut" }
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
                            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
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
                        backgroundColor: book.c0 || "#3a2d23",
                        backfaceVisibility: "hidden"
                    }}
                >
                    {/* Top Gold Foil Accent Stripe */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#d4a574] to-transparent shrink-0 opacity-85" />

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

                    {/* Bottom Gold Foil Accent Stripe */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#d4a574] to-transparent shrink-0 opacity-85" />
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
                        <div className="h-1 w-12 bg-[#d4a574]/60 mx-auto rounded-full mt-2" />
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
                                  scale: [1, 1.1, 1],
                                  opacity: [0.5, 0.32, 0.5],
                                  x: [0, 2, 0]
                              }
                            : undefined
                    }
                    transition={
                        floatingAnimation
                            ? { repeat: Infinity, duration: 4.2, ease: "easeInOut" }
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
