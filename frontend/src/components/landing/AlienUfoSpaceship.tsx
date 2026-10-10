import { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls, type Easing } from "framer-motion";

interface FlightPattern {
    name: string;
    keyframes: {
        x: string[] | number[];
        y: string[] | number[];
        rotate: number[];
        scale: number[];
        opacity: number[];
        beamOpacity?: number[];
    };
    duration: number;
    ease: Easing;
}

interface AlienUfoSpaceshipProps {
    isMidnight?: boolean;
}

export default function AlienUfoSpaceship({
    isMidnight = false,
}: AlienUfoSpaceshipProps = {}) {
    const controls = useAnimationControls();
    const beamControls = useAnimationControls();
    const [isPanicked, setIsPanicked] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        const getFlightPatterns = (isMobile: boolean): FlightPattern[] => {
            if (isMobile) {
                // Mobile Viewport (<768px): Cruise in the upper sky band (3vh to 16vh) above bookshelf & header
                return [
                    // Pattern 1: Mobile Recon (Left -> Center Sky -> Zoom Right)
                    {
                        name: "mobile-recon",
                        keyframes: {
                            x: ["-15vw", "20vw", "48vw", "52vw", "75vw", "115vw"],
                            y: ["5vh", "9vh", "13vh", "12vh", "8vh", "4vh"],
                            rotate: [6, -4, 0, 3, -7, 12],
                            scale: [0.7, 0.9, 1.0, 1.0, 0.85, 0.6],
                            opacity: [0, 1, 1, 1, 1, 0],
                            beamOpacity: [0, 0.2, 0.5, 0.5, 0.1, 0],
                        },
                        duration: 15,
                        ease: "easeInOut",
                    },
                    // Pattern 2: Mobile Right-to-Left Zigzag Scout
                    {
                        name: "mobile-zigzag",
                        keyframes: {
                            x: ["115vw", "75vw", "50vw", "25vw", "-15vw"],
                            y: ["4vh", "12vh", "6vh", "13vh", "5vh"],
                            rotate: [-8, 10, -8, 8, -12],
                            scale: [0.65, 0.95, 0.85, 0.95, 0.6],
                            opacity: [0, 1, 1, 1, 0],
                            beamOpacity: [0, 0.3, 0.15, 0.35, 0],
                        },
                        duration: 13,
                        ease: "easeInOut",
                    },
                    // Pattern 3: Mobile Center Sky Scan & Warp
                    {
                        name: "mobile-sky-scan",
                        keyframes: {
                            x: ["-15vw", "25vw", "50vw", "50vw", "70vw", "90vw", "115vw"],
                            y: ["9vh", "12vh", "15vh", "15vh", "10vh", "5vh", "-6vh"],
                            rotate: [4, -3, 0, 0, -10, -16, -22],
                            scale: [0.6, 0.85, 1.05, 1.05, 0.9, 0.7, 0.4],
                            opacity: [0, 1, 1, 1, 1, 1, 0],
                            beamOpacity: [0, 0.2, 0.65, 0.7, 0.2, 0, 0],
                        },
                        duration: 16,
                        ease: "easeInOut",
                    },
                    // Pattern 4: Mobile Diagonal Swoop
                    {
                        name: "mobile-swoop",
                        keyframes: {
                            x: ["115vw", "75vw", "45vw", "18vw", "-15vw"],
                            y: ["4vh", "8vh", "12vh", "14vh", "8vh"],
                            rotate: [-10, -4, 2, -6, -10],
                            scale: [0.7, 0.9, 0.95, 0.85, 0.6],
                            opacity: [0, 1, 1, 1, 0],
                            beamOpacity: [0, 0.25, 0.45, 0.2, 0],
                        },
                        duration: 12,
                        ease: "easeInOut",
                    },
                    // Pattern 5: Mobile Acrobat Loop & Exit
                    {
                        name: "mobile-acrobat",
                        keyframes: {
                            x: ["-15vw", "30vw", "50vw", "52vw", "48vw", "72vw", "115vw"],
                            y: ["9vh", "7vh", "11vh", "4vh", "10vh", "6vh", "3vh"],
                            rotate: [8, -6, 0, 360, 360, -8, 14],
                            scale: [0.65, 0.9, 0.95, 1.05, 0.95, 0.85, 0.5],
                            opacity: [0, 1, 1, 1, 1, 1, 0],
                            beamOpacity: [0, 0.2, 0.35, 0.1, 0.35, 0.2, 0],
                        },
                        duration: 14,
                        ease: "easeInOut",
                    },
                ];
            }

            // Desktop Viewport (>=768px): Full expansive sky paths
            return [
                // Pattern 1: Bookshelf Recon (Left -> Hover above books -> Zoom Right)
                {
                    name: "recon",
                    keyframes: {
                        x: ["-10vw", "25vw", "48vw", "52vw", "75vw", "110vw"],
                        y: ["10vh", "16vh", "24vh", "22vh", "14vh", "8vh"],
                        rotate: [6, -4, 0, 3, -8, 14],
                        scale: [0.7, 0.9, 1.05, 1.05, 0.85, 0.6],
                        opacity: [0, 1, 1, 1, 1, 0],
                        beamOpacity: [0, 0.2, 0.6, 0.6, 0.1, 0],
                    },
                    duration: 16,
                    ease: "easeInOut",
                },
                // Pattern 2: Right-to-Left Zigzag Scout
                {
                    name: "zigzag",
                    keyframes: {
                        x: ["110vw", "80vw", "55vw", "30vw", "-10vw"],
                        y: ["10vh", "22vh", "14vh", "24vh", "12vh"],
                        rotate: [-8, 12, -10, 8, -14],
                        scale: [0.65, 0.95, 0.85, 1.0, 0.6],
                        opacity: [0, 1, 1, 1, 0],
                        beamOpacity: [0, 0.3, 0.15, 0.4, 0],
                    },
                    duration: 14,
                    ease: "easeInOut",
                },
                // Pattern 3: Curious Low Hover & Scan (Left -> Center low -> Upward Warp)
                {
                    name: "low-scan",
                    keyframes: {
                        x: ["-10vw", "20vw", "50vw", "50vw", "60vw", "85vw", "110vw"],
                        y: ["20vh", "26vh", "30vh", "30vh", "22vh", "10vh", "-10vh"],
                        rotate: [4, -3, 0, 0, -12, -18, -25],
                        scale: [0.6, 0.85, 1.1, 1.15, 0.95, 0.7, 0.4],
                        opacity: [0, 1, 1, 1, 1, 1, 0],
                        beamOpacity: [0, 0.2, 0.75, 0.8, 0.2, 0, 0],
                    },
                    duration: 18,
                    ease: "easeInOut",
                },
                // Pattern 4: Top Diagonal Swoop (Top-Right -> Center -> Exit)
                {
                    name: "diagonal-swoop",
                    keyframes: {
                        x: ["105vw", "75vw", "45vw", "15vw", "-10vw"],
                        y: ["5vh", "14vh", "20vh", "26vh", "20vh"],
                        rotate: [-12, -4, 2, -6, -10],
                        scale: [0.7, 0.9, 1.0, 0.85, 0.6],
                        opacity: [0, 1, 1, 1, 0],
                        beamOpacity: [0, 0.25, 0.5, 0.2, 0],
                    },
                    duration: 13,
                    ease: "easeInOut",
                },
                // Pattern 5: Playful Loop & Spin (Top-Left -> Center Loop -> Exit Top-Right)
                {
                    name: "acrobat",
                    keyframes: {
                        x: ["-10vw", "35vw", "50vw", "52vw", "48vw", "70vw", "110vw"],
                        y: ["16vh", "14vh", "12vh", "6vh", "14vh", "11vh", "5vh"],
                        rotate: [8, -6, 0, 360, 360, -8, 15],
                        scale: [0.65, 0.9, 1.0, 1.1, 1.0, 0.85, 0.5],
                        opacity: [0, 1, 1, 1, 1, 1, 0],
                        beamOpacity: [0, 0.2, 0.4, 0.1, 0.4, 0.2, 0],
                    },
                    duration: 15,
                    ease: "easeInOut",
                },
            ];
        };

        let isRunning = true;

        const runUfoLifecycle = async () => {
            // Initial spawn delay: Fast (4s - 9s) during midnight/meteor shower, rare (45s - 85s) otherwise
            const initialDelay = isMidnight
                ? Math.random() * 5000 + 4000
                : Math.random() * 40000 + 45000;
            await new Promise((r) => setTimeout(r, initialDelay));

            while (isRunning && isMounted.current) {
                // Dynamically detect screen width for each flight pass
                const isMobile =
                    typeof window !== "undefined" && window.innerWidth < 768;
                const flightPatterns = getFlightPatterns(isMobile);

                // Select a random flight pattern
                const pattern =
                    flightPatterns[
                        Math.floor(Math.random() * flightPatterns.length)
                    ];

                // Trigger beam animation
                if (pattern.keyframes.beamOpacity) {
                    beamControls.start({
                        opacity: pattern.keyframes.beamOpacity,
                        transition: {
                            duration: pattern.duration,
                            ease: pattern.ease,
                        },
                    });
                }

                // Execute flight animation
                await controls.start({
                    x: pattern.keyframes.x,
                    y: pattern.keyframes.y,
                    rotate: pattern.keyframes.rotate,
                    scale: pattern.keyframes.scale,
                    opacity: pattern.keyframes.opacity,
                    transition: {
                        duration: pattern.duration,
                        ease: pattern.ease,
                    },
                });

                // Cooldown: Frequent during midnight (15s - 28s), dormant during normal mode (90s - 170s)
                const cooldown = isMidnight
                    ? Math.random() * 13000 + 15000
                    : Math.random() * 80000 + 90000;
                await new Promise((r) => setTimeout(r, cooldown));
            }
        };

        runUfoLifecycle();

        return () => {
            isRunning = false;
            isMounted.current = false;
            controls.stop();
            beamControls.stop();
        };
    }, [controls, beamControls, isMidnight]);

    // Interactive Hover/Touch/Click: Panicked Escape Warp!
    const handlePanicEscape = async () => {
        if (isPanicked) return;
        setIsPanicked(true);

        // Quick spin + warp into hyperspace
        await controls.start({
            rotate: [0, 360, 720],
            scale: [1, 1.3, 0.2],
            x: "115vw",
            y: "-15vh",
            opacity: [1, 1, 0],
            transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
        });

        setTimeout(() => {
            if (isMounted.current) setIsPanicked(false);
        }, 8000);
    };

    return (
        <motion.div
            animate={controls}
            initial={{ opacity: 0, x: "-15vw", y: "8vh", scale: 0.6 }}
            onClick={handlePanicEscape}
            onMouseEnter={handlePanicEscape}
            onTouchStart={handlePanicEscape}
            className="absolute z-10 cursor-pointer pointer-events-auto select-none group"
            style={{ willChange: "transform, opacity" }}
            title="👽 An Unidentified Bookish Object! (Klik / Sentuh untuk interaksi)"
        >
            <div className="relative flex flex-col items-center">
                {/* Glowing Tractor Light Beam beneath the UFO */}
                <motion.div
                    animate={beamControls}
                    initial={{ opacity: 0 }}
                    className="w-10 sm:w-16 h-14 sm:h-20 bg-gradient-to-b from-cyan-400/35 via-emerald-400/15 to-transparent blur-[3px] sm:blur-[4px] -mt-1 pointer-events-none"
                    style={{
                        clipPath: "polygon(32% 0%, 68% 0%, 100% 100%, 0% 100%)",
                    }}
                />

                {/* Vector Sci-Fi Saucer with Cockpit & Rotating Thruster Orbs */}
                <div className="absolute top-0 flex items-center justify-center">
                    <svg
                        viewBox="0 0 68 38"
                        fill="none"
                        className="w-[46px] sm:w-[62px] h-[27px] sm:h-[36px] overflow-visible filter drop-shadow-[0_0_10px_rgba(56,189,248,0.75)] sm:drop-shadow-[0_0_14px_rgba(56,189,248,0.75)] group-hover:drop-shadow-[0_0_20px_rgba(74,222,128,0.9)] transition-all duration-300"
                    >
                        {/* Glass Dome Cockpit */}
                        <ellipse
                            cx="34"
                            cy="13"
                            rx="14"
                            ry="10"
                            fill="url(#ufo-dome-grad)"
                            stroke="#38bdf8"
                            strokeWidth="1.3"
                            className="animate-pulse"
                        />

                        {/* Tiny Friendly Alien Silhouette inside cockpit */}
                        <circle
                            cx="34"
                            cy="11.5"
                            r="3.4"
                            fill="#4ade80"
                            className="filter drop-shadow-[0_0_4px_#4ade80]"
                        />
                        {/* Alien Eyes */}
                        <ellipse cx="32.7" cy="11" rx="0.8" ry="1.2" fill="#0f172a" />
                        <ellipse cx="35.3" cy="11" rx="0.8" ry="1.2" fill="#0f172a" />

                        {/* Metallic Flying Saucer Disc Upper Shell */}
                        <ellipse
                            cx="34"
                            cy="21"
                            rx="30"
                            ry="8"
                            fill="url(#ufo-body-grad)"
                            stroke="#818cf8"
                            strokeWidth="1.5"
                        />

                        {/* Metallic Lower Rim with Glow */}
                        <ellipse
                            cx="34"
                            cy="23"
                            rx="24"
                            ry="5.5"
                            fill="#0f172a"
                            stroke="#38bdf8"
                            strokeWidth="1.1"
                            opacity="0.95"
                        />

                        {/* 4 Pulsing Neon Thruster Light Orbs */}
                        <circle
                            cx="13"
                            cy="21.5"
                            r="2.0"
                            fill="#4ade80"
                            filter="drop-shadow(0 0 5px #4ade80)"
                            className="animate-ping opacity-75"
                        />
                        <circle cx="13" cy="21.5" r="2.0" fill="#4ade80" />
                        <circle cx="26" cy="23.5" r="2.2" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
                        <circle cx="42" cy="23.5" r="2.2" fill="#ffd166" filter="drop-shadow(0 0 6px #ffd166)" />
                        <circle cx="55" cy="21.5" r="2.0" fill="#f472b6" filter="drop-shadow(0 0 5px #f472b6)" />

                        {/* Center Propulsion Core */}
                        <ellipse
                            cx="34"
                            cy="24.5"
                            rx="7"
                            ry="2.4"
                            fill="#38bdf8"
                            filter="drop-shadow(0 0 10px #38bdf8)"
                        />

                        <defs>
                            <linearGradient
                                id="ufo-dome-grad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#38bdf8"
                                    stopOpacity="0.9"
                                />
                                <stop
                                    offset="60%"
                                    stopColor="#4ade80"
                                    stopOpacity="0.6"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#1e1b4b"
                                    stopOpacity="0.95"
                                />
                            </linearGradient>
                            <linearGradient
                                id="ufo-body-grad"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop offset="0%" stopColor="#1e1b4b" />
                                <stop offset="25%" stopColor="#4338ca" />
                                <stop offset="50%" stopColor="#818cf8" />
                                <stop offset="75%" stopColor="#4338ca" />
                                <stop offset="100%" stopColor="#1e1b4b" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
        </motion.div>
    );
}
