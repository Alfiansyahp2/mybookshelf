import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function VaseTall() {
    return (
        <div
            style={{
                position: "relative",
                width: 30,
                height: 62,
                flexShrink: 0,
            }}
        >
            {/* vase body */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 28,
                    height: 56,
                    background:
                        "linear-gradient(to right,#8a7060,#c4a888,#a08870)",
                    clipPath:
                        "polygon(20% 0%,80% 0%,95% 40%,100% 100%,0% 100%,5% 40%)",
                    boxShadow: "2px 3px 8px rgba(0,0,0,0.3)",
                }}
            />
            {/* neck highlight */}
            <div
                style={{
                    position: "absolute",
                    bottom: 44,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 14,
                    height: 3,
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 2,
                }}
            />
            {/* dried flowers */}
            {[0, 12, 24].map((x, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        bottom: 48,
                        left: `calc(50% + ${x - 12}px)`,
                        width: 2,
                        height: 18,
                        background: "#8a6030",
                        borderRadius: 1,
                        transform: `rotate(${(i - 1) * 12}deg)`,
                        transformOrigin: "bottom center",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: -4,
                            width: 9,
                            height: 7,
                            background: i === 1 ? "#d4784a" : "#c4a030",
                            borderRadius: "50%",
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

