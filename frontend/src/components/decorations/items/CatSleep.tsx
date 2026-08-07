import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function CatSleep() {
    return (
        <div
            style={{
                position: "relative",
                width: 60,
                height: 45,
                flexShrink: 0,
            }}
        >
            <motion.img
                src="/assets/decorations/cat_sleep.png"
                alt="Sleeping Cat"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                animate={{ scaleY: [1, 1.05, 1], scaleX: [1, 0.98, 1] }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            {/* Zzz floating animation */}
            <motion.div
                style={{
                    position: "absolute",
                    top: -10,
                    right: 0,
                    fontSize: 10,
                    color: "#fca5a5",
                    fontWeight: "bold",
                }}
                animate={{ opacity: [0, 1, 0], y: [0, -15], x: [0, 5, 0] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 1,
                }}
            >
                Z
            </motion.div>
            <motion.div
                style={{
                    position: "absolute",
                    top: -20,
                    right: -5,
                    fontSize: 14,
                    color: "#f87171",
                    fontWeight: "bold",
                }}
                animate={{ opacity: [0, 1, 0], y: [0, -20], x: [0, 8, 0] }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 2.5,
                }}
            >
                Z
            </motion.div>
        </div>
    );
}

