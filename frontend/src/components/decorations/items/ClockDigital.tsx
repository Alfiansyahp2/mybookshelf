import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ClockDigital() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hh = time.getHours().toString().padStart(2, "0");
    const mm = time.getMinutes().toString().padStart(2, "0");
    const ss = time.getSeconds() % 2 === 0 ? ":" : " ";

    return (
        <div
            style={{
                position: "relative",
                width: 44,
                height: 26,
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100%",
                    height: "100%",
                    background: "#2a2a2a",
                    borderRadius: 4,
                    border: "2px solid #1a1a1a",
                    boxShadow: "2px 3px 6px rgba(0,0,0,0.4)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: 3,
                    left: 3,
                    right: 3,
                    bottom: 3,
                    background: "#0a0a0a",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "inset 0 0 4px rgba(0,0,0,0.8)",
                }}
            >
                <span
                    style={{
                        fontFamily: "monospace",
                        color: "#ff3b30",
                        fontSize: 12,
                        fontWeight: "bold",
                        textShadow: "0 0 4px rgba(255,59,48,0.7)",
                        letterSpacing: 0,
                    }}
                >
                    {hh}
                    {ss}
                    {mm}
                </span>
            </div>
            <div
                style={{
                    position: "absolute",
                    top: -2,
                    left: 8,
                    width: 8,
                    height: 2,
                    background: "#444",
                    borderRadius: "2px 2px 0 0",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: -2,
                    right: 8,
                    width: 8,
                    height: 2,
                    background: "#444",
                    borderRadius: "2px 2px 0 0",
                }}
            />
        </div>
    );
}

