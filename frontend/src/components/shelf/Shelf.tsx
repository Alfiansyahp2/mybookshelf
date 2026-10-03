import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import DecorationPicker from "../decorations/DecorationPicker";
import {
    addDecoration,
    removeDecoration,
    type DecorationKind,
    type ShelfDecoration,
} from "../decorations/DecorationSystem";
import { useUpdateShelf } from "../../hooks/useShelves";
import type { Shelf, Book as BookType } from "../../types";
import {
    getShelfCapacity,
    useShelfScroll,
    DeleteShelfModal,
    ShelfWoodFrame,
    ShelfBooksTrack,
    ShelfInfoBar,
} from "./shelf-elements";

export interface ShelfProps {
    shelf: Shelf;
    books: BookType[];
    onBookClick?: (book: BookType) => void;
    onAddBook?: (shelfId: string) => void;
    onEditShelf?: (shelfId: string) => void;
    onDeleteShelf?: (shelfId: string) => void;
    isDrawerOpen?: boolean;
    selectedBookId?: string | null;
    shelfIndex?: number;
}

export function LibraryShelf({
    shelf,
    books,
    onBookClick,
    onAddBook,
    onEditShelf,
    onDeleteShelf,
    isDrawerOpen,
    selectedBookId,
    shelfIndex = 0,
}: ShelfProps) {
    const [pickerSlot, setPickerSlot] = useState<"left" | "right" | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const updateShelf = useUpdateShelf();

    // Horizontal scroll and swipe cues
    const { booksTrackRef, canScrollLeft, canScrollRight, handleTrackScroll } =
        useShelfScroll(books);

    // Shelf decorations
    const myDecos: ShelfDecoration[] = shelf.decorations || [];
    const leftDeco = myDecos.find((d) => d.slot === "left");
    const rightDeco = myDecos.find((d) => d.slot === "right");

    const handleSelectDeco = useCallback(
        (kind: DecorationKind, customData?: any) => {
            if (!pickerSlot) return;
            const newDecos = addDecoration(myDecos, kind, pickerSlot, customData);
            updateShelf.mutate({
                id: shelf.id,
                updates: { decorations: newDecos },
            });
        },
        [myDecos, pickerSlot, shelf.id, updateShelf]
    );

    const handleRemoveDeco = useCallback(() => {
        if (!pickerSlot) return;
        const newDecos = removeDecoration(myDecos, pickerSlot);
        updateShelf.mutate({
            id: shelf.id,
            updates: { decorations: newDecos },
        });
    }, [myDecos, pickerSlot, shelf.id, updateShelf]);

    // Shelf Capacity & Status
    const { occupied, percentage, pctColor } = useMemo(
        () => getShelfCapacity(books, shelf.capacity),
        [books, shelf.capacity]
    );

    const handleDeleteConfirm = useCallback(() => {
        setIsDeleting(false);
        onDeleteShelf?.(shelf.id);
    }, [onDeleteShelf, shelf.id]);

    return (
        <>
            {/* Decoration Picker Bottom Sheet */}
            <DecorationPicker
                isOpen={pickerSlot !== null}
                onClose={() => setPickerSlot(null)}
                slot={pickerSlot ?? "left"}
                current={pickerSlot === "left" ? leftDeco : rightDeco}
                onSelect={handleSelectDeco}
                onRemove={handleRemoveDeco}
            />

            {/* Delete Shelf Confirmation Modal */}
            <DeleteShelfModal
                isOpen={isDeleting}
                shelfName={shelf.name}
                onClose={() => setIsDeleting(false)}
                onConfirm={handleDeleteConfirm}
            />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: shelfIndex * 0.06 }}
                style={{ position: "relative", overflow: "visible" }}
            >
                {/* ── Shelf Cavity: Frame & Books ── */}
                <ShelfWoodFrame>
                    <ShelfBooksTrack
                        books={books}
                        onBookClick={onBookClick}
                        isDrawerOpen={isDrawerOpen}
                        selectedBookId={selectedBookId}
                        leftDeco={leftDeco}
                        rightDeco={rightDeco}
                        onOpenDecoPicker={setPickerSlot}
                        booksTrackRef={booksTrackRef}
                        canScrollLeft={canScrollLeft}
                        canScrollRight={canScrollRight}
                        onScroll={handleTrackScroll}
                    />
                </ShelfWoodFrame>

                {/* ── Bottom Info Strip & Action Menu ── */}
                <ShelfInfoBar
                    shelfName={shelf.name}
                    occupied={occupied}
                    capacity={shelf.capacity}
                    percentage={percentage}
                    pctColor={pctColor}
                    shelfIndex={shelfIndex}
                    hasScrollOverflow={canScrollLeft || canScrollRight}
                    onAddBook={onAddBook ? () => onAddBook(shelf.id) : undefined}
                    onEditShelf={onEditShelf ? () => onEditShelf(shelf.id) : undefined}
                    onDeleteClick={() => setIsDeleting(true)}
                />
            </motion.div>
        </>
    );
}

export default React.memo(LibraryShelf);
