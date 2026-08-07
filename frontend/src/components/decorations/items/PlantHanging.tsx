import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function PlantHanging() {
    const vines = [
        { x: 6, len: 44, delay: 0 },
        { x: 18, len: 32, delay: 0.3 },
        { x: 30, len: 50, delay: 0.6 },
        { x: 42, len: 38, delay: 0.9 },
        { x: 52, len: 28, delay: 1.2 },
    ];
    return (
        <div
            style={{
                position: "relative",
                width: 68,
                height: 70,
                flexShrink: 0,
            }}
        >
            {/* pot */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 44,
                    height: 22,
                    background: "linear-gradient(180deg,#c4784a,#8a4a1e)",
                    clipPath: "polygon(8% 0%,92% 0%,88% 100%,12% 100%)",
                    boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: 18,
                    left: "calc(50% - 24px)",
                    width: 48,
                    height: 6,
                    borderRadius: 3,
                    background: "linear-gradient(180deg,#d4885a,#a05828)",
                }}
            />
            {/* soil */}
            <div
                style={{
                    position: "absolute",
                    top: 22,
                    left: "calc(50% - 18px)",
                    width: 36,
                    height: 5,
                    borderRadius: "50%",
                    background: "#3a2010",
                }}
            />
            {/* vines */}
            {vines.map((v, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: "absolute",
                        top: 26,
                        left: v.x,
                        width: 2,
                        height: v.len,
                        borderRadius: 2,
                        background: "linear-gradient(180deg,#3a7a2a,#4a9a35)",
                        transformOrigin: "top center",
                    }}
                    animate={{ rotate: [-2, 2, -1, 2, 0] }}
                    transition={{
                        duration: 3 + i * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: v.delay,
                    }}
                >
                    {/* leaves on vine */}
                    {[12, 24, 36]
                        .filter((y) => y < v.len - 6)
                        .map((y) => (
                            <div
                                key={y}
                                style={{
                                    position: "absolute",
                                    top: y,
                                    left: -6,
                                    width: 12,
                                    height: 9,
                                    background: "#5ab848",
                                    borderRadius: "50% 10% 50% 10%",
                                    transform: "rotate(-30deg)",
                                }}
                            />
                        ))}
                </motion.div>
            ))}
        </div>
    );
}

