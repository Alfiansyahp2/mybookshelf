import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Lantern() {
    return (
        <div
            style={{
                position: "relative",
                width: 32,
                height: 58,
                flexShrink: 0,
            }}
        >
            {/* glow */}
            <motion.div
                style={{
                    position: "absolute",
                    top: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle,rgba(255,190,60,0.3) 0%,transparent 70%)",
                    pointerEvents: "none",
                }}
                animate={{ opacity: [0.7, 1, 0.6, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
            />
            {/* top hook */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 6,
                    height: 8,
                    border: "2px solid #8a6020",
                    borderBottom: "none",
                    borderRadius: "3px 3px 0 0",
                }}
            />
            {/* body */}
            <div
                style={{
                    position: "absolute",
                    top: 7,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 28,
                    height: 44,
                    background: "rgba(255,190,60,0.12)",
                    border: "2px solid #8a6020",
                    borderRadius: 4,
                    boxShadow: "inset 0 0 12px rgba(255,160,40,0.25)",
                }}
            >
                {/* glass panels */}
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            top: 4,
                            bottom: 4,
                            left: `${4 + i * 6}px`,
                            width: 4,
                            background: "rgba(255,200,80,0.15)",
                            borderRadius: 1,
                        }}
                    />
                ))}
                {/* flame */}
                <motion.div
                    style={{
                        position: "absolute",
                        top: 12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 7,
                        height: 11,
                        background:
                            "linear-gradient(180deg,#fff8c0,#ffd040,#ff8020)",
                        borderRadius: "50% 50% 35% 35%",
                    }}
                    animate={{ scaleX: [1, 0.85, 1.1, 0.9, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                />
            </div>
            {/* base */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 26,
                    height: 8,
                    background: "#8a6020",
                    borderRadius: 3,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
            />
        </div>
    );
}

