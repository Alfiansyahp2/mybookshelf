import React from "react";
import { useTranslation } from "react-i18next";
import { TEMP_COLORS, type ColorTemp } from "../../../hooks/useLighting";

const TEMPS: ColorTemp[] = ["warm", "neutral", "cool", "rose", "mint"];

interface ColorTempSelectorProps {
    colorTemp: ColorTemp;
    onChange: (temp: ColorTemp) => void;
}

export const ColorTempSelector: React.FC<ColorTempSelectorProps> = React.memo(
    function ColorTempSelector({ colorTemp, onChange }) {
        const { t } = useTranslation();

        return (
            <div>
                <p
                    style={{
                        margin: "0 0 8px",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#4a3020",
                    }}
                >
                    {t("shelf_led.color", "Warna Cahaya")}
                </p>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: 5,
                    }}
                >
                    {TEMPS.map((temp) => {
                        const tc = TEMP_COLORS[temp];
                        const isActive = colorTemp === temp;
                        return (
                            <button
                                key={temp}
                                onClick={() => onChange(temp)}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 3,
                                    padding: "7px 3px",
                                    borderRadius: 10,
                                    border: "none",
                                    cursor: "pointer",
                                    background: isActive
                                        ? `${tc.strip}22`
                                        : "rgba(0,0,0,0.03)",
                                    boxShadow: isActive
                                        ? `inset 0 0 0 1.5px ${tc.strip}, 0 0 8px ${tc.glow}0.3)`
                                        : "inset 0 0 0 1px rgba(0,0,0,0.07)",
                                    transition: "all 0.18s",
                                }}
                            >
                                {/* Colour swatch */}
                                <div
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: "50%",
                                        background: tc.strip,
                                        boxShadow: isActive
                                            ? `0 0 10px ${tc.glow}0.7)`
                                            : "0 1px 3px rgba(0,0,0,0.2)",
                                        transition: "box-shadow 0.3s",
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: 8.5,
                                        color: isActive
                                            ? "#2a1a08"
                                            : "rgba(122,92,66,0.5)",
                                        fontWeight: isActive ? 700 : 400,
                                    }}
                                >
                                    {t(`shelf_led.${temp}`, tc.label)}
                                </span>
                                <span style={{ fontSize: 11 }}>{tc.emoji}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }
);
