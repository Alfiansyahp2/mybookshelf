import { useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useThemeStore } from "../../store/useThemeStore";

const COMET_ANGLE_DEG = 28;
const TAN_28 = Math.tan((COMET_ANGLE_DEG * Math.PI) / 180); // ~0.5317

interface RareCelestialCometsProps {
    isMidnight?: boolean;
}

export default function RareCelestialComets({
    isMidnight = false,
}: RareCelestialCometsProps = {}) {
    const isDarkMode = useThemeStore((state) => state.isDarkMode);
    const comet1Controls = useAnimationControls();
    const comet2Controls = useAnimationControls();
    const isMounted = useRef(true);

    // ── Comet 1: Cyan / Sapphire Blue (Top-Left to Bottom-Right, Exact 28° Angle) ──
    useEffect(() => {
        isMounted.current = true;
        let isRunning = true;

        const runComet1 = async () => {
            // First spawn delay: Fast (3s - 7s) during midnight/meteor shower, rare (20s - 45s) otherwise
            const initialDelay = isMidnight
                ? Math.random() * 4000 + 3000
                : Math.random() * 25000 + 20000;
            await new Promise((r) => setTimeout(r, initialDelay));

            while (isRunning && isMounted.current) {
                const screenW =
                    typeof window !== "undefined" ? window.innerWidth : 1200;
                const totalDistX = screenW + 560;
                const totalDistY = totalDistX * TAN_28;
                const flightDuration = Math.random() * 4 + 24; // 24s - 28s

                await comet1Controls.start({
                    x: [-280, screenW + 280],
                    y: [-60, -60 + totalDistY],
                    opacity: [0, 0.95, 0.95, 0],
                    scale: [0.85, 1.05, 1.15, 1.0],
                    transition: {
                        duration: flightDuration,
                        ease: "linear",
                        times: [0, 0.08, 0.92, 1],
                    },
                });

                // Cooldown: Frequent during midnight (12s - 24s), dormant during normal mode (80s - 170s)
                const cooldown = isMidnight
                    ? Math.random() * 12000 + 12000
                    : Math.random() * 90000 + 80000;
                await new Promise((r) => setTimeout(r, cooldown));
            }
        };

        runComet1();

        return () => {
            isRunning = false;
            comet1Controls.stop();
        };
    }, [comet1Controls, isMidnight]);

    // ── Comet 2: Gold / Azure Blue (Top-Right to Bottom-Left, Exact 152° Angle) ──
    useEffect(() => {
        let isRunning = true;

        const runComet2 = async () => {
            // First spawn delay: Staggered (7s - 14s) during midnight, rare (65s - 110s) otherwise
            const initialDelay = isMidnight
                ? Math.random() * 7000 + 7000
                : Math.random() * 45000 + 65000;
            await new Promise((r) => setTimeout(r, initialDelay));

            while (isRunning && isMounted.current) {
                const screenW =
                    typeof window !== "undefined" ? window.innerWidth : 1200;
                const totalDistX = screenW + 560;
                const totalDistY = totalDistX * TAN_28;
                const flightDuration = Math.random() * 6 + 28; // 28s - 34s

                await comet2Controls.start({
                    x: [screenW + 280, -280],
                    y: [-60, -60 + totalDistY],
                    opacity: [0, 0.9, 0.9, 0],
                    scale: [0.85, 1.05, 1.15, 1.0],
                    transition: {
                        duration: flightDuration,
                        ease: "linear",
                        times: [0, 0.08, 0.92, 1],
                    },
                });

                // Cooldown: Frequent during midnight (14s - 28s), dormant during normal mode (100s - 200s)
                const cooldown = isMidnight
                    ? Math.random() * 14000 + 14000
                    : Math.random() * 100000 + 100000;
                await new Promise((r) => setTimeout(r, cooldown));
            }
        };

        runComet2();

        return () => {
            isRunning = false;
            comet2Controls.stop();
        };
    }, [comet2Controls, isMidnight]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Theme-specific colors for Comet 1 (Cyan / Sapphire Blue) and Comet 2 (Gold / Azure Blue)
    const comet1Core = isDarkMode ? "#ffffff" : "#1e40af";
    const comet1Inner = isDarkMode ? "#e0f2fe" : "#60a5fa";
    const comet1Glow = isDarkMode ? "#38bdf8" : "rgba(37, 99, 235, 0.55)";

    const comet2Core = isDarkMode ? "#ffffff" : "#0369a1";
    const comet2Inner = isDarkMode ? "#fef3c7" : "#38bdf8";
    const comet2Glow = isDarkMode ? "#ffd166" : "rgba(2, 132, 199, 0.55)";

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* ── COMET 1: Left to Right (Laser-Straight 28° Flight Vector) ── */}
            <motion.div
                animate={comet1Controls}
                initial={{ opacity: 0, x: -300, y: -60 }}
                className="absolute top-0 left-0"
                style={{ willChange: "transform, opacity" }}
            >
                <div
                    style={{
                        transform: `rotate(${COMET_ANGLE_DEG}deg)`,
                        transformOrigin: "254px 20px",
                    }}
                >
                    <svg
                        viewBox="0 0 280 40"
                        fill="none"
                        className="w-[220px] sm:w-[300px] h-[34px] sm:h-[42px] overflow-visible"
                    >
                        {/* Straight Tapered Glowing Comet Plume */}
                        <polygon
                            points="0,20 246,14 254,20 246,26"
                            fill="url(#comet1-tail-outer-framer)"
                            opacity={isDarkMode ? "0.6" : "0.65"}
                        />
                        <polygon
                            points="40,20 248,17 254,20 248,23"
                            fill="url(#comet1-tail-inner-framer)"
                            opacity={isDarkMode ? "0.85" : "0.85"}
                        />
                        <line
                            x1="0"
                            y1="20"
                            x2="254"
                            y2="20"
                            stroke={comet1Core}
                            strokeWidth={isDarkMode ? "2.2" : "2.6"}
                            strokeLinecap="round"
                        />
                        {/* ── Brilliant 4-Point Celestial Sparkle Star Head ── */}
                        <path
                            d="M 254 6 Q 254 20 268 20 Q 254 20 254 34 Q 254 20 240 20 Q 254 20 254 6 Z"
                            fill={comet1Core}
                            filter={`drop-shadow(0 0 14px ${comet1Glow})`}
                        />
                        {/* Diagonal Secondary Star Rays */}
                        <polygon
                            points="254,12 256.5,17.5 262,20 256.5,22.5 254,28 251.5,22.5 246,20 251.5,17.5"
                            fill={comet1Inner}
                        />
                        {/* Inner Bright Diamond Starlet */}
                        <path
                            d="M 254 11 Q 254 20 263 20 Q 254 20 254 29 Q 254 20 245 20 Q 254 20 254 11 Z"
                            fill={comet1Inner}
                        />
                        {/* Brilliant Star Center Glow */}
                        <circle
                            cx="254"
                            cy="20"
                            r="2.2"
                            fill={isDarkMode ? "#ffffff" : "#60a5fa"}
                            filter="drop-shadow(0 0 4px #ffffff)"
                        />
                        <defs>
                            <linearGradient
                                id="comet1-tail-outer-framer"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={isDarkMode ? "#818cf8" : "#bfdbfe"}
                                    stopOpacity="0"
                                />
                                <stop
                                    offset="60%"
                                    stopColor={isDarkMode ? "#38bdf8" : "#3b82f6"}
                                    stopOpacity={isDarkMode ? "0.4" : "0.6"}
                                />
                                <stop
                                    offset="100%"
                                    stopColor={comet1Core}
                                    stopOpacity="0.85"
                                />
                            </linearGradient>
                            <linearGradient
                                id="comet1-tail-inner-framer"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={isDarkMode ? "#38bdf8" : "#dbeafe"}
                                    stopOpacity="0"
                                />
                                <stop
                                    offset="70%"
                                    stopColor={isDarkMode ? "#c7d2fe" : "#60a5fa"}
                                    stopOpacity={isDarkMode ? "0.8" : "0.8"}
                                />
                                <stop
                                    offset="100%"
                                    stopColor={comet1Core}
                                    stopOpacity="1"
                                />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </motion.div>

            {/* ── COMET 2: Right to Left (Laser-Straight 152° Flight Vector) ── */}
            <motion.div
                animate={comet2Controls}
                initial={{ opacity: 0, x: 1400, y: -60 }}
                className="absolute top-0 left-0"
                style={{ willChange: "transform, opacity" }}
            >
                <div
                    style={{
                        transform: `rotate(${180 - COMET_ANGLE_DEG}deg)`,
                        transformOrigin: "254px 20px",
                    }}
                >
                    <svg
                        viewBox="0 0 280 40"
                        fill="none"
                        className="w-[210px] sm:w-[280px] h-[32px] sm:h-[40px] overflow-visible"
                    >
                        {/* Straight Tapered Glowing Comet Plume */}
                        <polygon
                            points="0,20 246,14 254,20 246,26"
                            fill="url(#comet2-tail-outer-framer)"
                            opacity={isDarkMode ? "0.55" : "0.6"}
                        />
                        <polygon
                            points="40,20 248,17 254,20 248,23"
                            fill="url(#comet2-tail-inner-framer)"
                            opacity={isDarkMode ? "0.85" : "0.8"}
                        />
                        <line
                            x1="0"
                            y1="20"
                            x2="254"
                            y2="20"
                            stroke={comet2Core}
                            strokeWidth={isDarkMode ? "2.2" : "2.6"}
                            strokeLinecap="round"
                        />
                        {/* ── Brilliant 4-Point Celestial Sparkle Star Head ── */}
                        <path
                            d="M 254 6 Q 254 20 268 20 Q 254 20 254 34 Q 254 20 240 20 Q 254 20 254 6 Z"
                            fill={comet2Core}
                            filter={`drop-shadow(0 0 14px ${comet2Glow})`}
                        />
                        {/* Diagonal Secondary Star Rays */}
                        <polygon
                            points="254,12 256.5,17.5 262,20 256.5,22.5 254,28 251.5,22.5 246,20 251.5,17.5"
                            fill={comet2Inner}
                        />
                        {/* Inner Bright Diamond Starlet */}
                        <path
                            d="M 254 11 Q 254 20 263 20 Q 254 20 254 29 Q 254 20 245 20 Q 254 20 254 11 Z"
                            fill={comet2Inner}
                        />
                        {/* Brilliant Star Center Glow */}
                        <circle
                            cx="254"
                            cy="20"
                            r="2.2"
                            fill={isDarkMode ? "#ffffff" : "#38bdf8"}
                            filter="drop-shadow(0 0 4px #ffffff)"
                        />
                        <defs>
                            <linearGradient
                                id="comet2-tail-outer-framer"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={isDarkMode ? "#f59e0b" : "#bae6fd"}
                                    stopOpacity="0"
                                />
                                <stop
                                    offset="60%"
                                    stopColor={isDarkMode ? "#ffd166" : "#0284c7"}
                                    stopOpacity={isDarkMode ? "0.4" : "0.6"}
                                />
                                <stop
                                    offset="100%"
                                    stopColor={comet2Core}
                                    stopOpacity="0.85"
                                />
                            </linearGradient>
                            <linearGradient
                                id="comet2-tail-inner-framer"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={isDarkMode ? "#fbbf24" : "#e0f2fe"}
                                    stopOpacity="0"
                                />
                                <stop
                                    offset="70%"
                                    stopColor={isDarkMode ? "#fed7aa" : "#38bdf8"}
                                    stopOpacity={isDarkMode ? "0.75" : "0.75"}
                                />
                                <stop
                                    offset="100%"
                                    stopColor={comet2Core}
                                    stopOpacity="1"
                                />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </motion.div>
        </div>
    );
}
