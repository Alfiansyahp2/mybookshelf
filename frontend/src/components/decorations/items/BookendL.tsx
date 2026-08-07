import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function BookendL({ flip = false }: { flip?: boolean }) {
    return (
        <div
            style={{
                position: "relative",
                width: 20,
                height: 50,
                flexShrink: 0,
                transform: flip ? "scaleX(-1)" : undefined,
            }}
        >
            {/* vertical */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 8,
                    height: 46,
                    background:
                        "linear-gradient(to right,#3a3a3a,#5a5a5a,#3a3a3a)",
                    borderRadius: "2px 2px 0 0",
                    boxShadow: "1px 0 4px rgba(0,0,0,0.4)",
                }}
            />
            {/* horizontal */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 20,
                    height: 8,
                    background: "linear-gradient(180deg,#5a5a5a,#2a2a2a)",
                    borderRadius: "0 2px 2px 0",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
                }}
            />
        </div>
    );
}

