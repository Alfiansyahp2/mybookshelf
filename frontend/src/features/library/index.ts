export {
    booksApi,
    transformBook,
    type BooksListResponse,
    type RawBook,
} from "./api/books.api";
export { shelvesApi } from "./api/shelves.api";
export { collectionsApi } from "./api/collections.api";

export {
    useBooks,
    useBook,
    useCreateBook,
    useUpdateBook,
    useDeleteBook,
    useStartReading,
    useFinishReading,
    useUploadCover,
    useUpdateProgress,
    useToggleFavorite,
    useUpdateNotes,
    useUpdateRating,
    useMoveToShelf,
    useBorrowBook,
    useReturnBook,
    useBookTimeline,
} from "./hooks/useBooks";
export {
    useShelves,
    useCreateShelf,
    useUpdateShelf,
    useUpdateShelfLayout,
    useDeleteShelf,
    useShelfOccupancy,
} from "./hooks/useShelves";
export {
    useCollections,
    useCollection,
    useCreateCollection,
    useUpdateCollection,
    useDeleteCollection,
    useAddBookToCollection,
    useRemoveBookFromCollection,
} from "./hooks/useCollections";
export {
    useLighting,
    TEMP_COLORS,
    type ColorTemp,
    type LightingState,
    type TempColorConfig,
} from "./hooks/useLightingStore";
export { useBookstore } from "./store/useBookstore";

export { default as Bookshelf } from "./components/shelf/Bookshelf";
export { default as Shelf } from "./components/shelf/Shelf";
export { default as MobileCoverGrid } from "./components/shelf/MobileCoverGrid";
export { default as AddBookModal } from "./components/modals/AddBookModal";
export { default as EditBookModal } from "./components/modals/EditBookModal";
export { default as BookDetailModal } from "./components/modals/BookDetailModal";
export { default as EditShelfModal } from "./components/shelf/EditShelfModal";
export { default as AddShelfModal } from "./components/shelf/AddShelfModal";
export { default as BookDetailLeftPage } from "./components/book-details/BookDetailLeftPage";
export {
    default as BookDetailRightPage,
    type SessionTabProps,
} from "./components/book-details/BookDetailRightPage";
