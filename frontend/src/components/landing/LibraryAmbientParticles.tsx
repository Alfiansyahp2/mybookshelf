import { useMemo, useState, useEffect } from "react";
import AlienUfoSpaceship from "./AlienUfoSpaceship";
import RareCelestialComets from "./RareCelestialComets";
import { useThemeStore } from "../../store/useThemeStore";

const CELESTIAL_SVG_TYPES = [
    {
        type: "star4",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
            </svg>
        ),
        minSize: 8,
        maxSize: 15,
    },
    {
        type: "star8",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 0L13.8 8.2L20.5 3.5L15.8 10.2L24 12L15.8 13.8L20.5 20.5L13.8 15.8L12 24L10.2 15.8L3.5 20.5L8.2 13.8L0 12L8.2 10.2L3.5 3.5L10.2 8.2Z" />
            </svg>
        ),
        minSize: 10,
        maxSize: 18,
    },
    {
        type: "moon",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12.3 2A10 10 0 0 0 22 12A10 10 0 1 1 12.3 2Z" />
            </svg>
        ),
        minSize: 12,
        maxSize: 19,
    },
    {
        type: "planet",
        svg: (
            <svg
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-full h-full"
            >
                <ellipse
                    cx="16"
                    cy="16"
                    rx="14"
                    ry="5"
                    transform="rotate(-20 16 16)"
                    strokeLinecap="round"
                    opacity="0.75"
                />
                <circle cx="16" cy="16" r="6" fill="currentColor" />
            </svg>
        ),
        minSize: 14,
        maxSize: 22,
    },
    {
        type: "diamond",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2L15 12L12 22L9 12Z" />
                <path d="M2 12L12 15L22 12L12 9Z" />
            </svg>
        ),
        minSize: 7,
        maxSize: 13,
    },
    {
        type: "stardust",
        svg: (
            <svg viewBox="0 0 10 10" fill="currentColor" className="w-full h-full">
                <circle cx="5" cy="5" r="4" />
            </svg>
        ),
        minSize: 4,
        maxSize: 7,
    },
];

const CELESTIAL_COLORS_DARK = [
    "#ffd166", // Starlight Gold
    "#38bdf8", // Electric Cosmic Cyan
    "#818cf8", // Nebula Indigo
    "#a78bfa", // Soft Violet Aurora
    "#c7d2fe", // Pale Celestial Diamond
    "#f472b6", // Rose Starlight
    "#34d399", // Mint Emerald Star
    "#ffffff", // Pure Starlight White
];

// Clean, harmonious blue palette for Light Mode (Blue Only)
const CELESTIAL_COLORS_LIGHT = [
    "#3b82f6", // Royal Blue
    "#2563eb", // Vibrant Blue
    "#1d4ed8", // Deep Sapphire Blue
    "#60a5fa", // Sky Blue
    "#0284c7", // Cerulean Blue
    "#1e40af", // Midnight Navy Blue
    "#38bdf8", // Bright Azure Blue
    "#2563eb", // Electric Blue
];

const FLOAT_ANIMATIONS = [
    "celestialFloatA",
    "celestialFloatB",
    "celestialFloatC",
    "celestialFloatD",
];

const METEOR_THEMES_DARK = [
    {
        // Electric Cyan & Blue
        from: "#38bdf8",
        mid: "#818cf8",
        head: "#ffffff",
        glow: "#38bdf8",
    },
    {
        // Starlight Gold & Amber
        from: "#ffd166",
        mid: "#f59e0b",
        head: "#ffffff",
        glow: "#ffd166",
    },
    {
        // Pink & Violet Aurora
        from: "#f472b6",
        mid: "#a855f7",
        head: "#ffffff",
        glow: "#c084fc",
    },
    {
        // Diamond Starlight White
        from: "#c7d2fe",
        mid: "#818cf8",
        head: "#ffffff",
        glow: "#ffffff",
    },
    {
        // Emerald Green Comet
        from: "#34d399",
        mid: "#059669",
        head: "#ffffff",
        glow: "#34d399",
    },
    {
        // Supernova Tangerine Flame
        from: "#fb923c",
        mid: "#e11d48",
        head: "#ffffff",
        glow: "#fb923c",
    },
];

// Pure blue streaks for Light Mode
const METEOR_THEMES_LIGHT = [
    {
        // Royal Sapphire Blue
        from: "#bfdbfe",
        mid: "#3b82f6",
        head: "#1d4ed8",
        glow: "rgba(37, 99, 235, 0.45)",
    },
    {
        // Deep Cobalt Navy Blue
        from: "#93c5fd",
        mid: "#2563eb",
        head: "#1e3a8a",
        glow: "rgba(29, 78, 216, 0.5)",
    },
    {
        // Electric Azure Cerulean Blue
        from: "#bae6fd",
        mid: "#0284c7",
        head: "#0369a1",
        glow: "rgba(2, 132, 199, 0.45)",
    },
];

interface LibraryAmbientParticlesProps {
    isMeteorShower?: boolean;
}

export default function LibraryAmbientParticles({
    isMeteorShower,
}: LibraryAmbientParticlesProps = {}) {
    const isDarkMode = useThemeStore((state) => state.isDarkMode);

    // Detect midnight / late night hours (22:00 - 05:00) as default fallback
    const [isMidnight, setIsMidnight] = useState(() => {
        const h = new Date().getHours();
        return h >= 22 || h < 5;
    });

    useEffect(() => {
        const checkTime = () => {
            const h = new Date().getHours();
            setIsMidnight(h >= 22 || h < 5);
        };
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const activeMeteorShower =
        isMeteorShower !== undefined ? isMeteorShower : isMidnight;

    const meteorThemes = isDarkMode ? METEOR_THEMES_DARK : METEOR_THEMES_LIGHT;
    const celestialColors = isDarkMode ? CELESTIAL_COLORS_DARK : CELESTIAL_COLORS_LIGHT;

    // Generate celestial background particles (85 particles during meteor shower)
    const particles = useMemo(() => {
        const list = [];
        const count = activeMeteorShower ? 85 : 38;

        for (let i = 0; i < count; i++) {
            const typeObj =
                CELESTIAL_SVG_TYPES[
                    Math.floor(Math.random() * CELESTIAL_SVG_TYPES.length)
                ];
            const color =
                celestialColors[
                    Math.floor(Math.random() * celestialColors.length)
                ];
            const size =
                Math.random() * (typeObj.maxSize - typeObj.minSize) +
                typeObj.minSize;

            const left = Math.random() * 94 + 3;
            const top = Math.random() * 90 + 5;

            const floatAnim =
                FLOAT_ANIMATIONS[i % FLOAT_ANIMATIONS.length];
            const floatDuration = Math.random() * 8 + 12; // 12s - 20s
            const floatDelay = -(Math.random() * 20);

            const twinkleDuration = Math.random() * 3 + 2.5; // 2.5s - 5.5s
            const twinkleDelay = -(Math.random() * 6);

            list.push({
                id: `celestial-${i}`,
                svg: typeObj.svg,
                color,
                size,
                left: `${left}%`,
                top: `${top}%`,
                floatAnim,
                floatDuration: `${floatDuration.toFixed(1)}s`,
                floatDelay: `${floatDelay.toFixed(1)}s`,
                twinkleDuration: `${twinkleDuration.toFixed(1)}s`,
                twinkleDelay: `${twinkleDelay.toFixed(1)}s`,
            });
        }
        return list;
    }, [activeMeteorShower, celestialColors]);

    // Shooting Stars: 66 vibrant meteors blazing in full meteor shower mode!
    const shootingStars = useMemo(() => {
        if (activeMeteorShower) {
            // High-density Perseid Meteor Shower: 66 shooting stars with continuous dense cascades
            const meteors = [];
            const count = 66;

            for (let i = 0; i < count; i++) {
                const colStep = (i % 22) / 22;
                const rowBand = Math.floor(i / 22);
                
                const left = (colStep * 96 + (rowBand * 7)) % 96 + 1;
                const top = rowBand * 14 + ((i * 3.7) % 15) + 1;
                const angle = 33 + ((i * 7) % 11);
                const duration = (4.0 + ((i * 1.3) % 2.2)).toFixed(2);
                const delay = ((i * 0.09) + ((i % 5) * 0.04)).toFixed(2);
                const scale = (0.8 + ((i * 0.23) % 0.65)).toFixed(2);
                const theme = i % meteorThemes.length;

                meteors.push({
                    id: `m-shower-66-${i}`,
                    left: `${left.toFixed(1)}%`,
                    top: `${top.toFixed(1)}%`,
                    angle,
                    duration: `${duration}s`,
                    delay: `${delay}s`,
                    scale: parseFloat(scale),
                    theme,
                });
            }
            return meteors;
        }

        // Regular Hours: 7 calm, gentle shooting stars
        return [
            { id: "m-0", left: "4%", top: "3%", angle: 35, duration: "11s", delay: "0.5s", theme: 0, scale: 1 },
            { id: "m-1", left: "28%", top: "2%", angle: 38, duration: "13s", delay: "2.8s", theme: 1, scale: 1.15 },
            { id: "m-2", left: "52%", top: "5%", angle: 36, duration: "12s", delay: "5.2s", theme: 2, scale: 0.95 },
            { id: "m-3", left: "74%", top: "4%", angle: 42, duration: "14s", delay: "7.5s", theme: 3, scale: 1.1 },
            { id: "m-4", left: "15%", top: "12%", angle: 34, duration: "12s", delay: "9.8s", theme: 4, scale: 1.2 },
            { id: "m-5", left: "40%", top: "8%", angle: 39, duration: "13s", delay: "4.2s", theme: 5, scale: 0.9 },
            { id: "m-6", left: "85%", top: "6%", angle: 37, duration: "15s", delay: "11.5s", theme: 0, scale: 1.05 },
        ];
    }, [activeMeteorShower, meteorThemes.length]);

    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-90"
            aria-hidden="true"
        >
            {/* Embedded GPU-accelerated Keyframes for seamless floating, comets & alien UFO */}
            <style>{`
                @keyframes celestialFloatA {
                    0% {
                        transform: translate3d(0px, 0px, 0px) rotate(0deg) scale(1);
                    }
                    50% {
                        transform: translate3d(14px, -22px, 0px) rotate(14deg) scale(1.08);
                    }
                    100% {
                        transform: translate3d(-10px, -36px, 0px) rotate(-12deg) scale(0.96);
                    }
                }

                @keyframes celestialFloatB {
                    0% {
                        transform: translate3d(0px, 0px, 0px) rotate(0deg) scale(0.95);
                    }
                    50% {
                        transform: translate3d(-16px, -18px, 0px) rotate(-18deg) scale(1.06);
                    }
                    100% {
                        transform: translate3d(12px, -30px, 0px) rotate(10deg) scale(1.02);
                    }
                }

                @keyframes celestialFloatC {
                    0% {
                        transform: translate3d(0px, 0px, 0px) rotate(0deg) scale(1.04);
                    }
                    50% {
                        transform: translate3d(10px, 16px, 0px) rotate(16deg) scale(0.94);
                    }
                    100% {
                        transform: translate3d(-14px, -16px, 0px) rotate(-14deg) scale(1.05);
                    }
                }

                @keyframes celestialFloatD {
                    0% {
                        transform: translate3d(0px, 0px, 0px) rotate(0deg) scale(0.98);
                    }
                    50% {
                        transform: translate3d(-12px, 20px, 0px) rotate(-12deg) scale(1.08);
                    }
                    100% {
                        transform: translate3d(16px, -18px, 0px) rotate(15deg) scale(0.95);
                    }
                }

                @keyframes celestialTwinkle {
                    0% {
                        opacity: 0.2;
                        filter: drop-shadow(0 0 2px currentColor);
                    }
                    50% {
                        opacity: 0.85;
                        filter: drop-shadow(0 0 8px currentColor);
                    }
                    100% {
                        opacity: 0.35;
                        filter: drop-shadow(0 0 3px currentColor);
                    }
                }

                @keyframes meteorStreak {
                    0% {
                        transform: translate3d(0, 0, 0) scale(0.6);
                        opacity: 0;
                    }
                    2% {
                        opacity: 1;
                    }
                    18% {
                        transform: translate3d(440px, 330px, 0) scale(1.15);
                        opacity: 0;
                    }
                    100% {
                        transform: translate3d(440px, 330px, 0) scale(1.15);
                        opacity: 0;
                    }
                }
            `}</style>

            {/* Continuous Floating Celestial Particles */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute pointer-events-none"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        color: p.color,
                        animation: `${p.floatAnim} ${p.floatDuration} ease-in-out infinite alternate`,
                        animationDelay: p.floatDelay,
                        willChange: "transform",
                    }}
                >
                    <div
                        className="w-full h-full"
                        style={{
                            animation: `celestialTwinkle ${p.twinkleDuration} ease-in-out infinite alternate`,
                            animationDelay: p.twinkleDelay,
                        }}
                    >
                        {p.svg}
                    </div>
                </div>
            ))}

            {/* High Density Shooting Stars (66 Meteors) - Perfectly straight motion alignment */}
            {shootingStars.map((cfg) => {
                const theme = meteorThemes[cfg.theme % meteorThemes.length];
                return (
                    <div
                        key={cfg.id}
                        className="absolute pointer-events-none"
                        style={{
                            left: cfg.left,
                            top: cfg.top,
                            animation: `meteorStreak ${cfg.duration} cubic-bezier(0.25, 1, 0.45, 1) infinite`,
                            animationDelay: cfg.delay,
                            opacity: 0,
                            willChange: "transform, opacity",
                        }}
                    >
                        <div
                            style={{
                                transform: "rotate(36.87deg) scale(" + cfg.scale + ")",
                                transformOrigin: "128px 13px",
                            }}
                        >
                            <svg
                                viewBox="0 0 150 26"
                                fill="none"
                                className="w-[145px] h-[24px] overflow-visible"
                            >
                                <line
                                    x1="0"
                                    y1="13"
                                    x2="126"
                                    y2="13"
                                    stroke={`url(#meteor-grad-${cfg.id})`}
                                    strokeWidth={isDarkMode ? "2.6" : "3.2"}
                                    strokeLinecap="round"
                                />
                                <circle
                                    cx="128"
                                    cy="13"
                                    r={isDarkMode ? "3.8" : "4.2"}
                                    fill={theme.head}
                                    filter={`drop-shadow(0 0 ${isDarkMode ? "12px" : "8px"} ${theme.glow})`}
                                />
                                <defs>
                                    <linearGradient
                                        id={`meteor-grad-${cfg.id}`}
                                        x1="0"
                                        y1="0"
                                        x2="1"
                                        y2="0"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor={theme.from}
                                            stopOpacity="0"
                                        />
                                        <stop
                                            offset="50%"
                                            stopColor={theme.mid}
                                            stopOpacity="0.85"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor={theme.head}
                                            stopOpacity="1"
                                        />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                );
            })}

            {/* ── RARE SLOW MAJESTIC CELESTIAL COMETS (Cyan & Gold, frequent during midnight / meteor shower) ── */}
            <RareCelestialComets isMidnight={activeMeteorShower} />

            {/* ── RARE ALIEN UFO FLYING SAUCER EASTER EGG (Autonomous randomized flight maneuvers, frequent during midnight) ── */}
            <AlienUfoSpaceship isMidnight={activeMeteorShower} />
        </div>
    );
}
