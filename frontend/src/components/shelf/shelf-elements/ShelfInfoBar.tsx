import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { INFO_H, WOOD } from "./shelfConstants";

interface ShelfInfoBarProps {
    shelfName: string;
    occupied: number;
    capacity: number;
    percentage: number;
    pctColor: string;
    shelfIndex: number;
    hasScrollOverflow: boolean;
    onAddBook?: () => void;
    onEditShelf?: () => void;
    onDeleteClick: () => void;
}

export const ShelfInfoBar: React.FC<ShelfInfoBarProps> = React.memo(
    function ShelfInfoBar({
        shelfName,
        occupied,
        capacity,
        percentage,
        pctColor,
        shelfIndex,
        hasScrollOverflow,
        onAddBook,
        onEditShelf,
        onDeleteClick,
    }) {
        const { t } = useTranslation();
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const menuRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent | TouchEvent) => {
                if (
                    menuRef.current &&
                    !menuRef.current.contains(event.target as Node)
                ) {
                    setIsMenuOpen(false);
                }
            };
            if (isMenuOpen) {
                document.addEventListener("mousedown", handleClickOutside);
                document.addEventListener("touchstart", handleClickOutside);
            }
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
                document.removeEventListener("touchstart", handleClickOutside);
            };
        }, [isMenuOpen]);

        return (
            <div
                style={{
                    height: INFO_H,
                    background: WOOD.info,
                    borderTop: "1px solid rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 24,
                    paddingRight: 10,
                    gap: 10,
                    overflow: "visible",
                }}
            >
                {/* Shelf name & swipe indicator */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexShrink: 0,
                    }}
                >
                    <span
                        style={{
                            color: "rgba(255,210,140,0.85)",
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            fontFamily: "'Georgia',serif",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 120,
                        }}
                    >
                        {shelfName}
                    </span>
                    {hasScrollOverflow && (
                        <span
                            className="text-[9px] text-[#d4a574]/80 font-mono tracking-wider px-1.5 py-0.5 rounded bg-white/5 border border-white/10 flex items-center gap-1"
                            title={t(
                                "library.swipe_hint",
                                "Geser untuk melihat buku lainnya"
                            )}
                        >
                            <span>⇄</span>
                            <span className="hidden xs:inline">
                                {t("library.swipe", "geser")}
                            </span>
                        </span>
                    )}
                </div>

                {/* Capacity Progress bar */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        minWidth: 0,
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            background: "rgba(255,255,255,0.08)",
                            overflow: "hidden",
                        }}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{
                                duration: 0.9,
                                ease: "easeOut",
                                delay: shelfIndex * 0.07 + 0.3,
                            }}
                            style={{
                                height: "100%",
                                borderRadius: 2,
                                background: pctColor,
                            }}
                        />
                    </div>
                    <span
                        style={{
                            fontSize: 9,
                            color: "rgba(255,195,110,0.5)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                        }}
                    >
                        {occupied}/{capacity}
                    </span>
                </div>

                {/* Vertical Divider */}
                <div
                    style={{
                        width: 1,
                        height: 14,
                        background: "rgba(255,255,255,0.1)",
                        flexShrink: 0,
                    }}
                />

                {/* Action buttons & menu popover */}
                <div
                    ref={menuRef}
                    style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        flexShrink: 0,
                    }}
                >
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                key="shelf-menu"
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                    position: "absolute",
                                    bottom: "100%",
                                    right: 0,
                                    marginBottom: 8,
                                    background: "rgba(30, 20, 10, 0.95)",
                                    backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 8,
                                    padding: 6,
                                    display: "flex",
                                    gap: 6,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                    zIndex: 50,
                                }}
                            >
                                <ActionBtn
                                    icon={<Plus size={14} />}
                                    title={t("shelf.add_book")}
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onAddBook?.();
                                    }}
                                    color="#ffffff"
                                />
                                <ActionBtn
                                    icon={<Pencil size={13} />}
                                    title={t("shelf.edit_shelf")}
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onEditShelf?.();
                                    }}
                                    color="#60a5fa"
                                />
                                <ActionBtn
                                    icon={<Trash2 size={13} />}
                                    title={t("shelf.delete_shelf")}
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onDeleteClick();
                                    }}
                                    color="#f87171"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <ActionBtn
                        icon={<MoreHorizontal size={14} />}
                        title={t("shelf.options", "Opsi Rak")}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        color="#ffffff"
                    />
                </div>
            </div>
        );
    }
);

interface ActionBtnProps {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
    color: string;
}

function ActionBtn({ icon, title, onClick, color }: ActionBtnProps) {
    return (
        <button
            onClick={onClick}
            title={title}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: 5,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                color,
                cursor: "pointer",
                transition: "all 0.12s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.13)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
        >
            {icon}
        </button>
    );
}
