import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Mug() {
    return (
        <div
            style={{
                position: "relative",
                width: 40,
                height: 44,
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 4,
                    width: 32,
                    height: 38,
                    background:
                        "linear-gradient(to right,#4a6a8a,#6a8aaa,#4a6a8a)",
                    borderRadius: "4px 4px 8px 8px",
                    boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 6,
                        left: 6,
                        right: 6,
                        bottom: 8,
                        background: "rgba(255,255,255,0.07)",
                        borderRadius: "2px 2px 6px 6px",
                    }}
                />
            </div>
            {/* handle */}
            <div
                style={{
                    position: "absolute",
                    bottom: 10,
                    right: 0,
                    width: 10,
                    height: 18,
                    border: "3px solid #5a7a9a",
                    borderRadius: "0 8px 8px 0",
                    borderLeft: "none",
                }}
            />
            {/* steam */}
            <motion.div
                style={{
                    position: "absolute",
                    bottom: 38,
                    left: 12,
                    width: 2,
                    height: 8,
                    background: "rgba(255,255,255,0.4)",
                    borderRadius: 2,
                }}
                animate={{
                    opacity: [0.4, 0.8, 0.3],
                    scaleY: [0.8, 1.2, 0.9],
                    y: [0, -4, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
                style={{
                    position: "absolute",
                    bottom: 38,
                    left: 20,
                    width: 2,
                    height: 6,
                    background: "rgba(255,255,255,0.35)",
                    borderRadius: 2,
                }}
                animate={{
                    opacity: [0.3, 0.7, 0.2],
                    scaleY: [1, 1.3, 0.8],
                    y: [0, -3, 0],
                }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
            />
        </div>
    );
}

