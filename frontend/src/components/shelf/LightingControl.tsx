import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLighting, TEMP_COLORS } from "../../hooks/useLighting";
import { TableLampButton, LightingControlPanel } from "./lighting-control";

export function LightingControl() {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { on, brightness, colorTemp, toggle, setBrightness, setColorTemp } =
        useLighting();

    const ct = TEMP_COLORS[colorTemp];

    // Close when clicking or touching outside the component
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [open]);

    const handleToggleOpen = useCallback(() => {
        setOpen((prev) => !prev);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ position: "relative", display: "inline-block" }}
        >
            {/* ── Toggle button (Table Lamp) ── */}
            <TableLampButton
                on={on}
                brightness={brightness}
                colorConfig={ct}
                onClick={handleToggleOpen}
            />

            {/* ── Control panel popup ────────── */}
            <LightingControlPanel
                open={open}
                on={on}
                brightness={brightness}
                colorTemp={colorTemp}
                colorConfig={ct}
                onToggle={toggle}
                onClose={handleClose}
                onBrightnessChange={setBrightness}
                onColorTempChange={setColorTemp}
            />
        </div>
    );
}

export default React.memo(LightingControl);
