import React from "react";
import { motion } from "framer-motion";
import type { TempColorConfig } from "../../../hooks/useLighting";

interface TableLampButtonProps {
    on: boolean;
    brightness: number;
    colorConfig: TempColorConfig;
    onClick: () => void;
}

export const TableLampButton: React.FC<TableLampButtonProps> = React.memo(
    function TableLampButton({ on, brightness, colorConfig: ct, onClick }) {
        return (
            <motion.button
                onClick={onClick}
                whileHover="hover"
                whileTap="tap"
                title="Kontrol Pencahayaan Rak"
                style={{
                    position: "relative",
                    width: 52,
                    height: 72,
                    border: "none",
                    cursor: "pointer",
                    background: "transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingBottom: 2,
                }}
            >
                {/* Glow effect when on */}
                {on && (
                    <motion.div
                        style={{
                            position: "absolute",
                            top: 5,
                            width: 90,
                            height: 70,
                            background: ct.glow,
                            filter: "blur(18px)",
                            borderRadius: "50%",
                            zIndex: 0,
                        }}
                        animate={{
                            opacity: [
                                (brightness / 100) * 0.6,
                                (brightness / 100) * 0.9,
                                (brightness / 100) * 0.6,
                            ],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}

                {/* Lamp Shade (Realistic conical 3D) */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        width: 50,
                        height: 36,
                        background: on
                            ? `linear-gradient(to right, #fffdf0, #fffae0 50%, #fffdf0), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)`
                            : `linear-gradient(to right, #e6e2d8, #dcd7cc 50%, #e6e2d8), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)`,
                        backgroundBlendMode: "multiply",
                        clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
                        zIndex: 10,
                        boxShadow: on
                            ? `inset 0 -12px 25px ${ct.strip}55, inset 0 2px 10px rgba(255,255,255,0.8)`
                            : "inset 0 2px 5px rgba(255,255,255,0.5)",
                        transition: "background 0.3s, box-shadow 0.3s",
                    }}
                >
                    {/* Top and bottom shade trim */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 2,
                            background: "rgba(0,0,0,0.15)",
                            boxShadow: "0 1px 2px rgba(255,255,255,0.5)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            background: "rgba(0,0,0,0.2)",
                            borderTop: "1px solid rgba(255,255,255,0.3)",
                        }}
                    />
                </div>

                {/* Pull chain (Animates down on tap) */}
                <motion.div
                    style={{
                        position: "absolute",
                        top: 34,
                        left: 18,
                        width: 3,
                        height: 18,
                        backgroundImage:
                            "radial-gradient(circle, #d4af37 40%, transparent 50%)",
                        backgroundSize: "3px 3px",
                        backgroundRepeat: "repeat-y",
                        zIndex: 8,
                        transformOrigin: "top center",
                    }}
                    variants={{
                        hover: { rotate: 2 },
                        tap: { height: 28, rotate: -2 },
                    }}
                    animate={on ? { rotate: [0, 6, -4, 2, 0] } : { rotate: 0 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                >
                    <div
                        style={{
                            position: "absolute",
                            bottom: -5,
                            left: -1,
                            width: 5,
                            height: 5,
                            background:
                                "radial-gradient(circle at 30% 30%, #ffd700, #b8860b)",
                            borderRadius: "50%",
                            boxShadow: "1px 2px 3px rgba(0,0,0,0.6)",
                        }}
                    />
                </motion.div>

                {/* Metal Stem */}
                <div
                    style={{
                        width: 5,
                        height: 26,
                        background:
                            "linear-gradient(to right, #4a3b29, #bfa67a 40%, #8b7355 60%, #3a2b19)",
                        zIndex: 5,
                        boxShadow: "2px 0 4px rgba(0,0,0,0.3)",
                    }}
                />

                {/* Weighted Brass Base */}
                <div
                    style={{
                        width: 40,
                        height: 12,
                        background:
                            "linear-gradient(to bottom, #bfa67a, #8b7355 30%, #4a3b29)",
                        borderRadius: "20px 20px 4px 4px",
                        zIndex: 5,
                        boxShadow:
                            "0 5px 8px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.4)",
                        position: "relative",
                    }}
                >
                    {/* Base bottom rim */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            background: "#2a1b09",
                            borderRadius: "0 0 4px 4px",
                        }}
                    />
                </div>
            </motion.button>
        );
    }
);
