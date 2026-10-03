import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ColorTemp, TempColorConfig } from "../../../hooks/useLighting";

interface LightingHeaderProps {
    on: boolean;
    brightness: number;
    colorTemp: ColorTemp;
    colorConfig: TempColorConfig;
    onToggle: () => void;
    onClose: () => void;
}

export const LightingHeader: React.FC<LightingHeaderProps> = React.memo(
    function LightingHeader({
        on,
        brightness,
        colorTemp,
        colorConfig: ct,
        onToggle,
        onClose,
    }) {
        const { t } = useTranslation();

        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px 10px",
                    borderBottom: "1px solid rgba(139,99,56,0.08)",
                    background: on
                        ? `linear-gradient(135deg, ${ct.strip}18, transparent)`
                        : "transparent",
                    transition: "background 0.4s",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <div
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: on ? ct.strip : "#e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background 0.3s",
                            boxShadow: on
                                ? `0 0 10px ${ct.glow}0.5)`
                                : "none",
                        }}
                    >
                        <Lightbulb
                            size={14}
                            color={on ? "#fff" : "#94a3b8"}
                        />
                    </div>
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#2a1a08",
                                fontFamily: "'Georgia',serif",
                            }}
                        >
                            {t("shelf_led.title", "LED Rak")}
                        </p>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 9.5,
                                color: "rgba(122,92,66,0.6)",
                            }}
                        >
                            {on
                                ? `${brightness}% · ${t(`shelf_led.${colorTemp}`, ct.label)}`
                                : "Mati"}
                        </p>
                    </div>
                </div>

                {/* Power toggle switch & Close button */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    <button
                        onClick={onToggle}
                        style={{
                            width: 42,
                            height: 22,
                            borderRadius: 11,
                            border: "none",
                            cursor: "pointer",
                            background: on ? ct.strip : "#cbd5e1",
                            position: "relative",
                            transition: "background 0.3s",
                            boxShadow: on
                                ? `0 0 8px ${ct.glow}0.4)`
                                : "none",
                        }}
                    >
                        <motion.div
                            animate={{ x: on ? 20 : 2 }}
                            transition={{
                                type: "spring",
                                damping: 20,
                                stiffness: 300,
                            }}
                            style={{
                                position: "absolute",
                                top: 2,
                                left: 0,
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                background: "white",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                            }}
                        />
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            border: "none",
                            background: "rgba(0,0,0,0.05)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <X size={12} color="#9c7a5a" />
                    </button>
                </div>
            </div>
        );
    }
);
