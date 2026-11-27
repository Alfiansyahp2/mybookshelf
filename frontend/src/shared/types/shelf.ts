import type { Book } from "./book";
import type { ShelfDecoration } from "./decorations";

// Shelf Types
export interface Shelf {
    id: string;
    name: string;
    capacity: number;
    order: number;
    span?: number;
    decorations?: ShelfDecoration[];
    books?: Book[];
}

export interface ShelfOccupancy {
    shelfId: string;
    total: number;
    occupied: number;
    available: number;
    percentage: number;
}

// Book with shelf position
export interface BookOnShelf extends Book {
    shelfId: string;
    position: number;
    isBorrowedSlot?: boolean; // If borrowed, shows empty slot
}
