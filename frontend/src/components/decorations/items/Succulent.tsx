import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Succulent() {
    const petals = [0, 45, 90, 135, 180, 225, 270, 315];
    return (
        <div
            style={{
                position: "relative",
                width: 46,
                height: 44,
                flexShrink: 0,
            }}
        >
            {/* pot */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 36,
                    height: 22,
                    background: "linear-gradient(180deg,#c48060,#8a4828)",
                    clipPath: "polygon(8% 0%,92% 0%,84% 100%,16% 100%)",
                    boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: 19,
                    left: "calc(50% - 20px)",
                    width: 40,
                    height: 6,
                    borderRadius: 3,
                    background: "#d4905a",
                }}
            />
            {/* soil */}
            <div
                style={{
                    position: "absolute",
                    bottom: 22,
                    left: "calc(50% - 14px)",
                    width: 28,
                    height: 4,
                    borderRadius: "50%",
                    background: "#2a1808",
                }}
            />
            {/* succulent rosette */}
            {petals.map((deg, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        bottom: 23,
                        left: "50%",
                        width: 14,
                        height: 10,
                        background: i % 2 === 0 ? "#5aaa48" : "#48923a",
                        borderRadius: "50% 50% 30% 30%",
                        transformOrigin: "bottom center",
                        transform: `translateX(-50%) rotate(${deg}deg)`,
                        boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.2)",
                    }}
                />
            ))}
            {/* center */}
            <div
                style={{
                    position: "absolute",
                    bottom: 27,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 10,
                    height: 8,
                    background: "#7aca62",
                    borderRadius: "50%",
                    boxShadow: "inset 0 -1px 3px rgba(0,0,0,0.2)",
                }}
            />
        </div>
    );
}

