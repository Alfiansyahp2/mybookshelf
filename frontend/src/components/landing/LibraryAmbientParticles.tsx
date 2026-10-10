import { useMemo } from "react";

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
        maxSize: 17,
    },
    {
        type: "moon",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12.3 2A10 10 0 0 0 22 12A10 10 0 1 1 12.3 2Z" />
            </svg>
        ),
        minSize: 12,
        maxSize: 18,
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
        maxSize: 12,
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

const CELESTIAL_COLORS = [
    "#ffd166", // Starlight Gold
    "#38bdf8", // Electric Cosmic Cyan
    "#818cf8", // Nebula Indigo
    "#a78bfa", // Soft Violet Aurora
    "#c7d2fe", // Pale Celestial Diamond
    "#ffffff", // Pure Starlight White
];

const FLOAT_ANIMATIONS = [
    "celestialFloatA",
    "celestialFloatB",
    "celestialFloatC",
    "celestialFloatD",
];

export default function LibraryAmbientParticles() {
    // Generate constant particles with negative animation delays so they start mid-float immediately
    const particles = useMemo(() => {
        const list = [];
        const count = 44;

        for (let i = 0; i < count; i++) {
            const typeObj =
                CELESTIAL_SVG_TYPES[
                    Math.floor(Math.random() * CELESTIAL_SVG_TYPES.length)
                ];
            const color =
                CELESTIAL_COLORS[
                    Math.floor(Math.random() * CELESTIAL_COLORS.length)
                ];
            const size =
                Math.random() * (typeObj.maxSize - typeObj.minSize) +
                typeObj.minSize;

            const left = Math.random() * 92 + 4; // 4% to 96%
            const top = Math.random() * 88 + 6; // 6% to 94%

            const floatAnim =
                FLOAT_ANIMATIONS[i % FLOAT_ANIMATIONS.length];
            const floatDuration = Math.random() * 8 + 12; // 12s to 20s
            const floatDelay = -(Math.random() * 20); // Negative delay starts mid-cycle

            const twinkleDuration = Math.random() * 3 + 3; // 3s to 6s
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
    }, []);

    // 5 Shooting Stars with long loop intervals and seamless opacity fade
    const shootingStars = useMemo(
        () => [
            {
                id: "meteor-1",
                left: "4%",
                top: "3%",
                angle: 35,
                duration: "13s",
                delay: "0.5s",
            },
            {
                id: "meteor-2",
                left: "28%",
                top: "2%",
                angle: 38,
                duration: "15s",
                delay: "3.8s",
            },
            {
                id: "meteor-3",
                left: "52%",
                top: "5%",
                angle: 36,
                duration: "14s",
                delay: "7.2s",
            },
            {
                id: "meteor-4",
                left: "74%",
                top: "4%",
                angle: 42,
                duration: "16s",
                delay: "10.5s",
            },
            {
                id: "meteor-5",
                left: "15%",
                top: "12%",
                angle: 34,
                duration: "18s",
                delay: "13.2s",
            },
        ],
        [],
    );

    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-90"
            aria-hidden="true"
        >
            {/* Embedded GPU-accelerated Keyframes for continuous seamless floating */}
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
                    1.5% {
                        opacity: 1;
                    }
                    9% {
                        transform: translate3d(340px, 260px, 0) scale(1.1);
                        opacity: 0;
                    }
                    100% {
                        transform: translate3d(340px, 260px, 0) scale(1.1);
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

            {/* Rare & Natural Shooting Stars */}
            {shootingStars.map((cfg, idx) => (
                <div
                    key={cfg.id}
                    className="absolute pointer-events-none"
                    style={{
                        left: cfg.left,
                        top: cfg.top,
                        animation: `meteorStreak ${cfg.duration} cubic-bezier(0.25, 1, 0.5, 1) infinite`,
                        animationDelay: cfg.delay,
                        opacity: 0,
                        willChange: "transform, opacity",
                    }}
                >
                    <div
                        style={{
                            transform: `rotate(${cfg.angle}deg)`,
                            transformOrigin: "left center",
                        }}
                    >
                        <svg
                            viewBox="0 0 130 24"
                            fill="none"
                            className="w-[120px] h-[22px] overflow-visible"
                        >
                            <path
                                d="M0 12 L110 12"
                                stroke={`url(#meteor-grad-${idx})`}
                                strokeWidth="2.4"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="112"
                                cy="12"
                                r="3.5"
                                fill="#ffffff"
                                filter="drop-shadow(0 0 10px #38bdf8)"
                            />
                            <defs>
                                <linearGradient
                                    id={`meteor-grad-${idx}`}
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#38bdf8"
                                        stopOpacity="0"
                                    />
                                    <stop
                                        offset="60%"
                                        stopColor="#818cf8"
                                        stopOpacity="0.7"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#ffffff"
                                        stopOpacity="1"
                                    />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            ))}
        </div>
    );
}
