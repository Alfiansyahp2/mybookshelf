import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ColorTemp, TempColorConfig } from "../../../hooks/useLighting";
import { LightingHeader } from "./LightingHeader";
import { BrightnessControl } from "./BrightnessControl";
import { ColorTempSelector } from "./ColorTempSelector";

interface LightingControlPanelProps {
    open: boolean;
    on: boolean;
    brightness: number;
    colorTemp: ColorTemp;
    colorConfig: TempColorConfig;
    onToggle: () => void;
    onClose: () => void;
    onBrightnessChange: (value: number) => void;
    onColorTempChange: (temp: ColorTemp) => void;
    panelRef?: React.RefObject<HTMLDivElement | null>;
}

export const LightingControlPanel: React.FC<LightingControlPanelProps> =
    React.memo(function LightingControlPanel({
        open,
        on,
        brightness,
        colorTemp,
        colorConfig: ct,
        onToggle,
        onClose,
        onBrightnessChange,
        onColorTempChange,
        panelRef,
    }) {
        return (
            <AnimatePresence>
                {open && (
                    <motion.div
                        ref={panelRef}
                        initial={{ opacity: 0, scale: 0.88, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: -8 }}
                        transition={{
                            type: "spring",
                            damping: 22,
                            stiffness: 280,
                        }}
                        style={{
                            position: "absolute",
                            top: 48,
                            right: 0,
                            width: 240,
                            zIndex: 9999,
                            background: "rgba(255,251,245,0.98)",
                            backdropFilter: "blur(16px)",
                            borderRadius: 16,
                            border: "1px solid rgba(139,99,56,0.14)",
                            boxShadow:
                                "0 12px 40px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.08)",
                            overflow: "hidden",
                        }}
                    >
                        {/* Panel Header */}
                        <LightingHeader
                            on={on}
                            brightness={brightness}
                            colorTemp={colorTemp}
                            colorConfig={ct}
                            onToggle={onToggle}
                            onClose={onClose}
                        />

                        {/* Panel Controls Body */}
                        <div
                            style={{
                                padding: "12px 14px 14px",
                                opacity: on ? 1 : 0.4,
                                transition: "opacity 0.3s",
                                pointerEvents: on ? "auto" : "none",
                            }}
                        >
                            <BrightnessControl
                                brightness={brightness}
                                colorConfig={ct}
                                onChange={onBrightnessChange}
                            />
                            <ColorTempSelector
                                colorTemp={colorTemp}
                                onChange={onColorTempChange}
                            />
                        </div>

                        {/* Glowing Preview Strip */}
                        <motion.div
                            style={{
                                height: 6,
                                background: on
                                    ? `linear-gradient(to right, ${ct.strip}66, ${ct.strip}, ${ct.strip}66)`
                                    : "rgba(0,0,0,0.05)",
                                boxShadow: on
                                    ? `0 0 12px ${ct.glow}${(brightness / 100).toFixed(2)})`
                                    : "none",
                                transition: "background 0.4s, box-shadow 0.4s",
                            }}
                            animate={
                                on
                                    ? { opacity: [0.8, 1, 0.8] }
                                    : { opacity: 0.3 }
                            }
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        );
    });
