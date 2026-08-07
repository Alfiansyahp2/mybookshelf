import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function FramePhoto({ customData }: { customData?: any }) {
    return (
        <div
            style={{
                position: "relative",
                width: 52,
                height: 42,
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    border: "4px solid #7a5020",
                    borderRadius: 3,
                    background: "linear-gradient(135deg,#d4c0a0,#b8a080)",
                    boxShadow: "2px 3px 10px rgba(0,0,0,0.4)",
                    overflow: "hidden",
                }}
            >
                {customData?.imageUrl ? (
                    <img
                        src={customData.imageUrl}
                        alt="frame"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    <>
                        {/* simple landscape scene */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "38%",
                                background:
                                    "linear-gradient(180deg,#4a7a3a,#2a5020)",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "65%",
                                background:
                                    "linear-gradient(180deg,#7ab0e0,#b8d8f8)",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                bottom: "32%",
                                left: "40%",
                                width: 0,
                                height: 0,
                                borderLeft: "6px solid transparent",
                                borderRight: "6px solid transparent",
                                borderBottom: "10px solid #e8e4cc",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                bottom: "30%",
                                left: "15%",
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.7)",
                            }}
                        />
                    </>
                )}
            </div>
            {/* frame stand */}
            <div
                style={{
                    position: "absolute",
                    bottom: -4,
                    left: "55%",
                    width: 3,
                    height: 8,
                    background: "#5a3a10",
                    transform: "rotate(15deg)",
                    borderRadius: 2,
                }}
            />
        </div>
    );
}

