import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export default function AnimeHeroHeadline() {
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const underlineRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!headlineRef.current) return;

        // Animate words staggered with anime.js v4
        animate(".hero-word", {
            translateY: [24, 0],
            opacity: [0, 1],
            rotateX: [-20, 0],
            delay: stagger(70, { start: 100 }),
            duration: 900,
            ease: "outCubic",
            onComplete: () => {
                // Animate underline stroke
                if (underlineRef.current) {
                    animate(underlineRef.current, {
                        width: ["0%", "100%"],
                        opacity: [0.3, 1],
                        duration: 800,
                        ease: "inOutQuad"
                    });
                }
            }
        });
    }, []);

    const mainText = "Abadikan setiap lembar cerita &";
    const highlightText = "perjalanan membacamu.";

    return (
        <h1
            ref={headlineRef}
            className="font-sans text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight leading-[1.2] text-[#4a3b2f] flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1"
        >
            {mainText.split(" ").map((word, i) => (
                <span
                    key={i}
                    className="hero-word inline-block opacity-0 transform-gpu"
                >
                    {word}
                </span>
            ))}
            <span className="hero-word inline-block relative font-serif italic font-bold text-[#7a5c42] opacity-0 transform-gpu ml-1">
                {highlightText}
                <span
                    ref={underlineRef}
                    className="absolute left-0 bottom-0.5 h-[2px] bg-gradient-to-r from-[#7a5c42] via-[#d4a574] to-[#7a5c42] rounded-full opacity-0"
                    style={{ width: "0%" }}
                />
            </span>
        </h1>
    );
}
