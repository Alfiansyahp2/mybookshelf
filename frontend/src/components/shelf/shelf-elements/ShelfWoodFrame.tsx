import React from "react";
import { motion } from "framer-motion";
import { useLighting, TEMP_COLORS } from "../../../hooks/useLighting";
import {
    BOOK_AREA_H,
    BOARD_H,
    WOOD,
    SIDE_GRAIN_Y,
    VERTICAL_GRAINS,
    HORIZONTAL_GRAINS,
    BOARD_GRAINS,
} from "./shelfConstants";

interface ShelfWoodFrameProps {
    children: React.ReactNode;
}

export const ShelfWoodFrame: React.FC<ShelfWoodFrameProps> = React.memo(
    function ShelfWoodFrame({ children }) {
        const { on: lightOn, brightness, colorTemp } = useLighting();
        const ct = TEMP_COLORS[colorTemp];
        const ledOpacity = lightOn ? brightness / 100 : 0;

        return (
            <div
                style={{
                    position: "relative",
                    height: BOOK_AREA_H + BOARD_H,
                    overflow: "visible",
                }}
            >
                {/* Left wooden panel */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 20,
                        zIndex: 10,
                        background: WOOD.side,
                        boxShadow:
                            "inset -4px 0 8px rgba(0,0,0,0.25), 2px 0 4px rgba(0,0,0,0.15)",
                    }}
                >
                    {SIDE_GRAIN_Y.map((y) => (
                        <div
                            key={y}
                            style={{
                                position: "absolute",
                                left: 3,
                                right: 3,
                                top: y,
                                height: 1,
                                background: "rgba(0,0,0,0.1)",
                                borderRadius: 1,
                            }}
                        />
                    ))}
                </div>

                {/* Right wooden panel */}
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 20,
                        zIndex: 10,
                        background: WOOD.sideR,
                        boxShadow:
                            "inset 4px 0 8px rgba(0,0,0,0.25), -2px 0 4px rgba(0,0,0,0.15)",
                    }}
                >
                    {SIDE_GRAIN_Y.map((y) => (
                        <div
                            key={y}
                            style={{
                                position: "absolute",
                                left: 3,
                                right: 3,
                                top: y,
                                height: 1,
                                background: "rgba(0,0,0,0.1)",
                                borderRadius: 1,
                            }}
                        />
                    ))}
                </div>

                {/* Back wall — warm visible teak */}
                <div
                    style={{
                        position: "absolute",
                        left: 20,
                        right: 20,
                        top: 0,
                        bottom: BOARD_H,
                        zIndex: 0,
                        background: WOOD.back,
                        overflow: "hidden",
                        transition: "filter 0.5s",
                    }}
                >
                    {/* Teak vertical grain lines */}
                    {VERTICAL_GRAINS.map((p) => (
                        <div
                            key={p}
                            style={{
                                position: "absolute",
                                top: 0,
                                bottom: 0,
                                left: `${p}%`,
                                width: 1,
                                background: "rgba(0,0,0,0.055)",
                            }}
                        />
                    ))}

                    {/* Horizontal wood grain variation */}
                    {HORIZONTAL_GRAINS.map((y) => (
                        <div
                            key={y}
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: y,
                                height: 20,
                                background: "rgba(0,0,0,0.04)",
                            }}
                        />
                    ))}

                    {/* LED glow spreading downward */}
                    <motion.div
                        animate={{ opacity: ledOpacity * 0.85 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 120,
                            background: `linear-gradient(180deg, ${ct.glow}1) 0%, ${ct.glow}0.1) 60%, transparent 100%)`,
                            zIndex: 1,
                            pointerEvents: "none",
                        }}
                    />

                    {/* Ambient dimming overlay */}
                    <motion.div
                        animate={{ opacity: (1 - ledOpacity) * 0.85 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,1)",
                            zIndex: 2,
                            pointerEvents: "none",
                        }}
                    />

                    {/* LED strip physical bar */}
                    <motion.div
                        animate={{
                            opacity: ledOpacity,
                            boxShadow:
                                ledOpacity > 0
                                    ? `0 0 ${25 * ledOpacity}px ${8 * ledOpacity}px ${ct.glow}${(ledOpacity * 0.9).toFixed(2)}), 0 0 6px ${ct.strip}`
                                    : "none",
                        }}
                        transition={{ duration: 0.4 }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            zIndex: 3,
                            background: `linear-gradient(to right, ${ct.strip}aa, ${ct.strip}, ${ct.strip}aa)`,
                        }}
                    />
                </div>

                {/* ── Content row: left deco + books track + right deco ── */}
                {children}

                {/* Bottom shelf board */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: BOARD_H,
                        zIndex: 8,
                        background: WOOD.board,
                        boxShadow:
                            "inset 0 3px 4px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.35)",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 2,
                            background: "rgba(255,255,255,0.2)",
                        }}
                    />
                    {BOARD_GRAINS.map((p) => (
                        <div
                            key={p}
                            style={{
                                position: "absolute",
                                top: 2,
                                bottom: 2,
                                left: `${p}%`,
                                width: 1,
                                background: "rgba(0,0,0,0.06)",
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }
);
