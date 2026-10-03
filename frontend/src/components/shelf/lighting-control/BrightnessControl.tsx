import React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TempColorConfig } from "../../../hooks/useLighting";

const BRIGHTNESS_PRESETS = [25, 50, 75, 100] as const;

interface BrightnessControlProps {
    brightness: number;
    colorConfig: TempColorConfig;
    onChange: (value: number) => void;
}

export const BrightnessControl: React.FC<BrightnessControlProps> = React.memo(
    function BrightnessControl({ brightness, colorConfig: ct, onChange }) {
        const { t } = useTranslation();

        return (
            <div style={{ marginBottom: 14 }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                        }}
                    >
                        <Moon size={11} color="rgba(122,92,66,0.5)" />
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#4a3020",
                            }}
                        >
                            {t("shelf_led.brightness", "Kecerahan")}
                        </span>
                        <Sun size={11} color="rgba(122,92,66,0.5)" />
                    </div>
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: ct.strip,
                            background: `${ct.strip}18`,
                            padding: "2px 8px",
                            borderRadius: 8,
                        }}
                    >
                        {brightness}%
                    </span>
                </div>

                {/* Custom range slider */}
                <div
                    style={{
                        position: "relative",
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {/* Track background */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            height: 6,
                            borderRadius: 3,
                            background: "rgba(139,99,56,0.1)",
                        }}
                    />
                    {/* Track fill with dynamic glow */}
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            height: 6,
                            borderRadius: 3,
                            width: `${brightness}%`,
                            background: `linear-gradient(to right, ${ct.strip}88, ${ct.strip})`,
                            boxShadow: `0 0 6px ${ct.glow}0.4)`,
                            transition:
                                "width 0.05s, background 0.3s, box-shadow 0.3s",
                        }}
                    />
                    <input
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={brightness}
                        onChange={(e) => onChange(Number(e.target.value))}
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            width: "100%",
                            opacity: 0,
                            cursor: "pointer",
                            height: 20,
                            margin: 0,
                        }}
                    />
                    {/* Thumb indicator */}
                    <motion.div
                        style={{
                            position: "absolute",
                            top: "50%",
                            transform: "translate(-50%,-50%)",
                            left: `${brightness}%`,
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: "white",
                            boxShadow: `0 1px 6px rgba(0,0,0,0.25), 0 0 0 2.5px ${ct.strip}`,
                            pointerEvents: "none",
                            transition: "left 0.05s, box-shadow 0.3s",
                        }}
                    />
                </div>

                {/* Brightness quick presets */}
                <div
                    style={{
                        display: "flex",
                        gap: 4,
                        marginTop: 6,
                    }}
                >
                    {BRIGHTNESS_PRESETS.map((v) => (
                        <button
                            key={v}
                            onClick={() => onChange(v)}
                            style={{
                                flex: 1,
                                padding: "3px 0",
                                borderRadius: 5,
                                border: "none",
                                fontSize: 9.5,
                                fontWeight: 600,
                                cursor: "pointer",
                                background:
                                    brightness === v
                                        ? ct.strip
                                        : "rgba(139,99,56,0.08)",
                                color:
                                    brightness === v
                                        ? "white"
                                        : "rgba(122,92,66,0.7)",
                                transition: "all 0.15s",
                            }}
                        >
                            {v}%
                        </button>
                    ))}
                </div>
            </div>
        );
    }
);
