import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function VaseRound() {
    return (
        <div
            style={{
                position: "relative",
                width: 38,
                height: 48,
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 36,
                    height: 40,
                    background:
                        "linear-gradient(135deg,#5a8a9a,#3a6a7a,#2a5a6a)",
                    borderRadius: "40% 40% 45% 45%",
                    boxShadow: "2px 3px 8px rgba(0,0,0,0.3)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: 36,
                    left: "calc(50% - 10px)",
                    width: 20,
                    height: 8,
                    background: "linear-gradient(135deg,#6aaabc,#4a8a9c)",
                    borderRadius: "50% 50% 0 0",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 24,
                    height: 12,
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "50%",
                }}
            />
        </div>
    );
}

