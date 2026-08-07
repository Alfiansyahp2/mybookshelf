import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function CatSit() {
    return (
        <div
            style={{
                position: "relative",
                width: 45,
                height: 60,
                flexShrink: 0,
            }}
        >
            <motion.img
                src="/assets/decorations/cat_sit.png"
                alt="Sitting Cat"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transformOrigin: "bottom center",
                }}
                animate={{ rotate: [-2, 2, -2], scaleY: [1, 0.98, 1] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}

// ── Master render function ────────────────────────────────

