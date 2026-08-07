import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function PlantPot() {
    const leaves = [
        { r: -50, x: -18, y: -8, s: 1.1 },
        { r: -20, x: -8, y: -16, s: 0.95 },
        { r: 10, x: 2, y: -18, s: 1.0 },
        { r: 35, x: 14, y: -10, s: 0.9 },
        { r: 60, x: 18, y: -2, s: 0.82 },
    ];
    return (
        <div
            style={{
                position: "relative",
                width: 58,
                height: 76,
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 40,
                    height: 30,
                    background: "linear-gradient(180deg,#c4784a,#8a4a1e)",
                    clipPath: "polygon(8% 0%,92% 0%,84% 100%,16% 100%)",
                    boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: 26,
                    left: "calc(50% - 23px)",
                    width: 46,
                    height: 7,
                    borderRadius: 3,
                    background: "linear-gradient(180deg,#d4885a,#a05828)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: 32,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 4,
                    height: 20,
                    borderRadius: 2,
                    background: "#3a6a2a",
                }}
            />
            {leaves.map((l, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: "absolute",
                        bottom: 46,
                        left: `calc(50% + ${l.x}px)`,
                        width: 26,
                        height: 20,
                        background: `linear-gradient(135deg,#4a9a40,#5ab848,#2d6a2a)`,
                        borderRadius: "50% 10% 50% 10%",
                        transform: `rotate(${l.r}deg) scale(${l.s})`,
                        transformOrigin: "bottom center",
                        boxShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                    }}
                    animate={{ rotate: [l.r - 1.5, l.r + 1.5, l.r] }}
                    transition={{
                        duration: 3.5 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                    }}
                />
            ))}
        </div>
    );
}

