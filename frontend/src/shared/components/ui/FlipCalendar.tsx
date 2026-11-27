import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function FlipCalendar({ onClick }: { onClick?: () => void }) {
    const { i18n } = useTranslation();
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        // Update daily at midnight
        const now = new Date();
        const msUntilMidnight =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
            ).getTime() - now.getTime();

        const timeout = setTimeout(() => {
            setDate(new Date());
            // After first midnight, set a 24h interval
            setInterval(() => setDate(new Date()), 24 * 60 * 60 * 1000);
        }, msUntilMidnight);

        return () => clearTimeout(timeout);
    }, []);

    const dayStr = date.getDate().toString().padStart(2, "0");
    const digit1 = dayStr[0];
    const digit2 = dayStr[1];

    const locale = i18n.language === "id" ? "id-ID" : "en-US";
    const monthStr = date
        .toLocaleString(locale, { month: "short" })
        .toUpperCase();

    return (
        <div
            onClick={onClick}
            className={`relative flex flex-col items-center justify-end w-32 h-16 ml-2 ${onClick ? "cursor-pointer hover:scale-95 transition-transform" : ""}`}
            style={{
                transform: "scale(0.85)",
                transformOrigin: "bottom",
                filter: "drop-shadow(0 6px 4px rgba(0,0,0,0.4))"
            }}
            title="Klik untuk membuka Kalender Membaca"
        >
            {/* Base */}
            <div
                className="absolute bottom-0 w-full h-3 rounded-sm z-0"
                style={{ 
                    backgroundColor: "#3a2313",
                    backgroundImage: "linear-gradient(to bottom, #4a2f1d, #2b180c)",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    borderBottom: "1px solid rgba(0,0,0,0.8)",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.4)" 
                }}
            />

            {/* Golden Posts (Metallic Cylinders) */}
            <div 
                className="absolute bottom-[10px] left-10 w-[5px] h-12 z-0" 
                style={{
                    background: "linear-gradient(to right, #6b4d1b 0%, #d4af37 30%, #fff2a8 50%, #d4af37 70%, #523b12 100%)",
                    boxShadow: "1px 0 2px rgba(0,0,0,0.5), inset 0 -2px 3px rgba(0,0,0,0.3)",
                    borderTopLeftRadius: "2px",
                    borderTopRightRadius: "2px"
                }}
            />
            <div 
                className="absolute bottom-[10px] right-10 w-[5px] h-12 z-0"
                style={{
                    background: "linear-gradient(to right, #6b4d1b 0%, #d4af37 30%, #fff2a8 50%, #d4af37 70%, #523b12 100%)",
                    boxShadow: "1px 0 2px rgba(0,0,0,0.5), inset 0 -2px 3px rgba(0,0,0,0.3)",
                    borderTopLeftRadius: "2px",
                    borderTopRightRadius: "2px"
                }}
            />

            {/* Top bar (Wooden Cylinder) */}
            <div 
                className="absolute top-0 w-full h-3 rounded-full shadow-md z-20" 
                style={{ 
                    backgroundColor: "#3a2313",
                    backgroundImage: "linear-gradient(to bottom, #593922 0%, #3a2313 40%, #1c0f06 100%)",
                    boxShadow: "0 3px 4px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.15)",
                    borderBottom: "1px solid rgba(0,0,0,0.6)"
                }}
            />

            {/* Cards container */}
            <div className="absolute top-2 left-0 w-full flex justify-between px-[6px] gap-1 z-10">
                <FlipCard text={digit1} />
                <FlipCard text={digit2} />
                <FlipCard text={monthStr} isText />
            </div>
        </div>
    );
}

function FlipCard({
    text,
    isText = false,
}: {
    text: string;
    isText?: boolean;
}) {
    return (
        <div className="relative flex flex-col items-center drop-shadow-md">
            {/* Top Ring (Metal) */}
            <div
                className="absolute -top-[10px] w-2.5 h-3 z-30"
                style={{ 
                    background: "transparent",
                    border: "2px solid #a8a8a8",
                    borderBottomWidth: "0px",
                    borderRadius: "4px 4px 0 0",
                    boxShadow: "inset 0 1px 0 white",
                    backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.4) 50%, rgba(0,0,0,0.3) 100%)"
                }}
            />
            {/* Bottom Ring part behind the card */}
            <div
                className="absolute -top-[10px] w-2.5 h-[14px] border-2 border-[#555] rounded-[4px] z-0"
            />

            {/* Card (Solid Split Flap) */}
            <div 
                className="relative w-8 h-11 bg-[#e8e6dc] rounded-sm flex items-center justify-center overflow-hidden mt-1"
                style={{
                    boxShadow: "inset 0 0 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.3)",
                    border: "1px solid #c2bfb1",
                    borderBottomColor: "#9e9c90"
                }}
            >
                {/* Upper Half Flap Shade */}
                <div 
                    className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-black/5 z-0"
                />
                
                {/* Horizontal split line (Real 3D gap) */}
                <div 
                    className="absolute top-1/2 left-0 w-full h-[1.5px] z-10" 
                    style={{
                        backgroundColor: "#1a1a1a",
                        boxShadow: "0 1px 0 rgba(255,255,255,0.6)",
                        transform: "translateY(-50%)"
                    }}
                />

                {isText ? (
                    <div
                        className="flex flex-col items-center justify-center leading-[0.8] font-black text-[#1f1a17] text-[10px] z-10 tracking-widest mt-0.5"
                        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                    >
                        <span style={{ textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>{text[0]}</span>
                        <span style={{ textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>{text[1]}</span>
                        <span style={{ textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>{text[2]}</span>
                    </div>
                ) : (
                    <span
                        className="font-black text-[#1f1a17] text-[26px] z-10 mt-0.5"
                        style={{ 
                            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                            textShadow: "0 1px 0 rgba(255,255,255,0.4)",
                            lineHeight: 1
                        }}
                    >
                        {text}
                    </span>
                )}
            </div>
        </div>
    );
}

