import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ClockSmall() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hDeg = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
    const mDeg = time.getMinutes() * 6;
    return (
        <div
            style={{
                position: "relative",
                width: 38,
                height: 52,
                flexShrink: 0,
            }}
        >
            {/* base */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 28,
                    height: 8,
                    background: "linear-gradient(180deg,#a08060,#6a5030)",
                    borderRadius: 3,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
            />
            {/* clock face */}
            <div
                style={{
                    position: "absolute",
                    bottom: 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 36,
                    height: 38,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#f5f0e8,#e8e0d0)",
                    border: "3px solid #8a6030",
                    boxShadow:
                        "0 2px 8px rgba(0,0,0,0.35), inset 0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                {/* hour marks */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                    (deg) => (
                        <div
                            key={deg}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                width: 1.5,
                                height: deg % 90 === 0 ? 6 : 4,
                                background: "#4a3020",
                                transformOrigin: `0 -${deg % 90 === 0 ? 12 : 13}px`,
                                transform: `rotate(${deg}deg) translateY(-50%)`,
                            }}
                        />
                    ),
                )}
                {/* hour hand */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: 2,
                        height: 10,
                        background: "#2a1a08",
                        transformOrigin: "50% 100%",
                        transform: `rotate(${hDeg}deg) translateX(-50%)`,
                        marginTop: -10,
                        marginLeft: -1,
                    }}
                />
                {/* minute hand */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: 1.5,
                        height: 13,
                        background: "#4a3020",
                        transformOrigin: "50% 100%",
                        transform: `rotate(${mDeg}deg) translateX(-50%)`,
                        marginTop: -13,
                        marginLeft: -0.75,
                    }}
                />
                {/* center dot */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "#8a4020",
                        transform: "translate(-50%,-50%)",
                    }}
                />
            </div>
        </div>
    );
}

