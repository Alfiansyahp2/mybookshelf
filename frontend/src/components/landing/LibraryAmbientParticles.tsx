import { useEffect, useRef } from "react";
import { animate, random } from "animejs";

const CELESTIAL_SVG_TYPES = [
    // 4-Point Sparkle Star
    {
        name: "star4",
        svg: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z"/></svg>`,
        defaultSize: [8, 14]
    },
    // 8-Point Celestial Star
    {
        name: "star8",
        svg: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M12 0L13.8 8.2L20.5 3.5L15.8 10.2L24 12L15.8 13.8L20.5 20.5L13.8 15.8L12 24L10.2 15.8L3.5 20.5L8.2 13.8L0 12L8.2 10.2L3.5 3.5L10.2 8.2Z"/></svg>`,
        defaultSize: [10, 16]
    },
    // Delicate Crescent Moon
    {
        name: "moon",
        svg: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M12.3 2A10 10 0 0 0 22 12A10 10 0 1 1 12.3 2Z"/></svg>`,
        defaultSize: [12, 18]
    },
    // Saturn Ringed Planet
    {
        name: "planet",
        svg: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" class="w-full h-full"><ellipse cx="16" cy="16" rx="14" ry="5" transform="rotate(-20 16 16)" stroke-linecap="round" opacity="0.75"/><circle cx="16" cy="16" r="6" fill="currentColor"/></svg>`,
        defaultSize: [14, 20]
    },
    // Diamond Stardust
    {
        name: "diamond",
        svg: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M12 2L15 12L12 22L9 12Z"/><path d="M2 12L12 15L22 12L12 9Z"/></svg>`,
        defaultSize: [6, 11]
    }
];

const CELESTIAL_COLORS = [
    "#d4a574", // Warm Gold
    "#7a5c42", // Deep Walnut
    "#c29b68", // Muted Brass
    "#e8c89b", // Soft Amber
    "#b58552", // Cinnamon Gold
    "#f3e5d8"  // Soft Cream Glow
];

export default function LibraryAmbientParticles() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = "";

        // 1. Create floating small celestial stars, comets, moons & stardust (38 count)
        const celestialCount = 38;

        for (let i = 0; i < celestialCount; i++) {
            const particle = document.createElement("div");
            const celestialType = CELESTIAL_SVG_TYPES[Math.floor(Math.random() * CELESTIAL_SVG_TYPES.length)];
            const color = CELESTIAL_COLORS[Math.floor(Math.random() * CELESTIAL_COLORS.length)];

            const [minSize, maxSize] = celestialType.defaultSize;
            const size = Math.random() * (maxSize - minSize) + minSize;

            particle.className = "absolute pointer-events-none celestial-particle";
            particle.innerHTML = celestialType.svg;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.color = color;
            particle.style.left = `${Math.random() * 92 + 4}%`;
            particle.style.top = `${Math.random() * 88 + 6}%`;
            particle.style.opacity = `${Math.random() * 0.35 + 0.15}`;
            particle.style.filter = `drop-shadow(0 0 ${size * 0.35}px ${color}bb)`;

            container.appendChild(particle);
        }

        // 2. Create Realistic Shooting Stars (Bintang Jatuh / Komet Meluncur)
        // Nested DOM structure so rotation isn't wiped out by Anime.js translateX/Y
        const shootingStarConfigs = [
            { id: "star-0", left: "5%", top: "4%", angle: 36, delay: 100 },
            { id: "star-1", left: "32%", top: "2%", angle: 40, delay: 1800 },
            { id: "star-2", left: "60%", top: "6%", angle: 38, delay: 3400 },
            { id: "star-3", left: "82%", top: "10%", angle: 42, delay: 5000 }
        ];

        shootingStarConfigs.forEach((cfg, idx) => {
            const wrapper = document.createElement("div");
            wrapper.className = `absolute pointer-events-none shooting-star-mover-${idx}`;
            wrapper.style.left = cfg.left;
            wrapper.style.top = cfg.top;

            const rotator = document.createElement("div");
            rotator.style.transform = `rotate(${cfg.angle}deg)`;
            rotator.style.transformOrigin = "left center";

            rotator.innerHTML = `
                <svg viewBox="0 0 120 24" fill="none" class="w-[110px] h-[20px] overflow-visible">
                    <path d="M0 12 L100 12" stroke="url(#shooting-grad-${idx})" stroke-width="2.2" stroke-linecap="round"/>
                    <circle cx="102" cy="12" r="3.2" fill="#ffffff" filter="drop-shadow(0 0 6px #f3e5d8)"/>
                    <defs>
                        <linearGradient id="shooting-grad-${idx}" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="#d4a574" stop-opacity="0"/>
                            <stop offset="50%" stop-color="#d4a574" stop-opacity="0.6"/>
                            <stop offset="100%" stop-color="#ffffff" stop-opacity="0.95"/>
                        </linearGradient>
                    </defs>
                </svg>
            `;

            wrapper.appendChild(rotator);
            container.appendChild(wrapper);
        });

        // Animate Floating & Twinkling Celestial Bodies
        const celestialAnim = animate(".celestial-particle", {
            translateY: () => [random(-12, 12), random(-30, -5)],
            translateX: () => [random(-12, 12), random(-12, 12)],
            rotate: () => [0, random(-90, 90)],
            scale: () => [random(0.85, 0.95), random(1.05, 1.2), random(0.85, 0.95)],
            opacity: () => [random(0.15, 0.25), random(0.45, 0.7), random(0.15, 0.25)],
            duration: () => random(8000, 16000),
            delay: () => random(0, 3000),
            loop: true,
            direction: "alternate",
            ease: "inOutSine"
        });

        // Animate Shooting Stars Streaking Diagonally Downwards continuously
        const shootingAnims = shootingStarConfigs.map((cfg, idx) => {
            return animate(`.shooting-star-mover-${idx}`, {
                translateX: [0, 320],
                translateY: [0, 250],
                opacity: [0, 1, 0],
                duration: 1800,
                delay: cfg.delay,
                loop: true,
                ease: "easeOutQuad"
            });
        });

        return () => {
            celestialAnim.pause();
            shootingAnims.forEach((a) => a.pause());
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-90"
            aria-hidden="true"
        />
    );
}



