import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Candle({ scale = 1 }: { scale?: number }) {
    return (
        <div
            style={{
                position: "relative",
                width: 16 * scale,
                height: 52 * scale,
                flexShrink: 0,
            }}
        >
            {/* glow */}
            <motion.div
                style={{
                    position: "absolute",
                    top: -14 * scale,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 32 * scale,
                    height: 32 * scale,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(255,210,80,0.5) 0%, transparent 75%)",
                    pointerEvents: "none",
                }}
                animate={{
                    opacity: [0.8, 1, 0.7, 1],
                    scale: [0.9, 1.1, 0.95, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            {/* flame */}
            <motion.div
                style={{
                    position: "absolute",
                    top: -10 * scale,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 7 * scale,
                    height: 12 * scale,
                    background:
                        "linear-gradient(180deg,#fff8c0 0%,#ffd040 40%,#ff8020 100%)",
                    borderRadius: "50% 50% 35% 35%",
                    boxShadow: `0 0 6px 2px rgba(255,160,40,0.55)`,
                }}
                animate={{
                    scaleX: [1, 0.8, 1.1, 0.9, 1],
                    skewX: [0, -3, 3, -2, 0],
                }}
                transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            {/* wick */}
            <div
                style={{
                    position: "absolute",
                    top: 1 * scale,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 1.5,
                    height: 4 * scale,
                    background: "#2a1608",
                }}
            />
            {/* body */}
            <div
                style={{
                    position: "absolute",
                    top: 4 * scale,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 14 * scale,
                    height: 46 * scale,
                    background:
                        "linear-gradient(to right,#f0e8d8,#fffdf5,#e8e0c8)",
                    borderRadius: `${3 * scale}px ${3 * scale}px ${4 * scale}px ${4 * scale}px`,
                    boxShadow: "1px 1px 4px rgba(0,0,0,0.2)",
                }}
            />
            {/* drip */}
            <div
                style={{
                    position: "absolute",
                    top: 6 * scale,
                    left: 2 * scale,
                    width: 3 * scale,
                    height: 7 * scale,
                    background: "rgba(245,238,224,0.8)",
                    borderRadius: "0 0 50% 50%",
                }}
            />
        </div>
    );
}

