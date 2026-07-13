# 🎯 Modal System - Complete Guide

Sistem modal lengkap untuk seluruh operasi CRUD di proyek MyBookshelf.

## 📦 Components Created

### 1. **Core Modal Wrapper**
- 📁 `components/ui/Modal.tsx` - Reusable modal wrapper component

### 2. **CRUD Modals**
- 📁 `components/modals/BookModal.tsx` - Create, Update, Delete Books
- 📁 `components/modals/ShelfModal.tsx` - Create, Update, Delete Shelves
- 📁 `components/modals/CollectionModal.tsx` - Create, Update, Delete Collections
- 📁 `components/modals/RoomModal.tsx` - Create, Update, Delete Rooms

### 3. **API Hooks**
- 📁 `hooks/useBooks.ts` ✅ (Already exists)
- 📁 `hooks/useShelves.ts` ✅ (Already exists)
- 📁 `hooks/useCollections.ts` 🆕 (Created)
- 📁 `hooks/useRooms.ts` 🆕 (Created)

## 🎨 Features

### ✅ Unified Design
- Semua modals menggunakan desain yang konsisten
- Responsive (mobile & desktop)
- Smooth animations dengan Framer Motion
- Backdrop blur dan proper z-index layering

### ✅ Mode System
Setiap modal mendukung 3 mode:
- **`create`** - Untuk menambahkan entity baru
- **`update`** - Untuk mengedit entity yang sudah ada
- **`delete`** - Untuk menghapus entity dengan konfirmasi

### ✅ Form Validation
- Required fields dengan proper validation
- Real-time form state management
- Auto-reset setelah submit berhasil

### ✅ Loading States
- Indikator loading saat submit
- Disabled buttons saat proses berjalan
- Error handling otomatis

### ✅ Delete Confirmation
- Warning message untuk delete operations
- Preview entity yang akan dihapus
- Konfirmasi explisit required

## 🚀 Usage Examples

### 1. Book Modal

#### Create Book:
```tsx
import BookModal from './components/modals/BookModal'
import { useState } from 'react'

export default function MyComponent() {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [selectedShelfId, setSelectedShelfId] = useState<string>()

  return (
    <>
      <button onClick={() => setIsBookModalOpen(true)}>
        Add New Book
      </button>

      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        mode="create"
        defaultShelfId={selectedShelfId}
      />
    </>
  )
}
```

#### Update Book:
```tsx
const [isBookModalOpen, setIsBookModalOpen] = useState(false)
const [selectedBook, setSelectedBook] = useState<Book | null>(null)

const handleEditBook = (book: Book) => {
  setSelectedBook(book)
  setIsBookModalOpen(true)
}

<BookModal
  isOpen={isBookModalOpen}
  onClose={() => {
    setIsBookModalOpen(false)
    setSelectedBook(null)
  }}
  mode="update"
  book={selectedBook}
/>
```

#### Delete Book:
```tsx
const handleDeleteBook = (book: Book) => {
  setSelectedBook(book)
  setIsBookModalOpen(true)
}

<BookModal
  isOpen={isBookModalOpen}
  onClose={() => {
    setIsBookModalOpen(false)
    setSelectedBook(null)
  }}
  mode="delete"
  book={selectedBook}
/>
```

### 2. Shelf Modal

```tsx
import ShelfModal from './components/modals/ShelfModal'

const [isShelfModalOpen, setIsShelfModalOpen] = useState(false)
const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null)
const [shelfMode, setShelfMode] = useState<'create' | 'update' | 'delete'>('create')

// Create Shelf
<button onClick={() => {
  setShelfMode('create')
  setSelectedShelf(null)
  setIsShelfModalOpen(true)
}}>
  Add New Shelf
</button>

// Update Shelf
<button onClick={() => {
  setShelfMode('update')
  setSelectedShelf(shelf)
  setIsShelfModalOpen(true)
}}>
  Edit Shelf
</button>

// Delete Shelf
<button onClick={() => {
  setShelfMode('delete')
  setSelectedShelf(shelf)
  setIsShelfModalOpen(true)
}}>
  Delete Shelf
</button>

<ShelfModal
  isOpen={isShelfModalOpen}
  onClose={() => setIsShelfModalOpen(false)}
  mode={shelfMode}
  shelf={selectedShelf}
/>
```

### 3. Collection Modal

```tsx
import CollectionModal from './components/modals/CollectionModal'

const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false)
const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
const [collectionMode, setCollectionMode] = useState<'create' | 'update' | 'delete'>('create')

<CollectionModal
  isOpen={isCollectionModalOpen}
  onClose={() => setIsCollectionModalOpen(false)}
  mode={collectionMode}
  collection={selectedCollection}
/>
```

### 4. Room Modal

```tsx
import RoomModal from './components/modals/RoomModal'

const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
const [roomMode, setRoomMode] = useState<'create' | 'update' | 'delete'>('create')

<RoomModal
  isOpen={isRoomModalOpen}
  onClose={() => setIsRoomModalOpen(false)}
  mode={roomMode}
  room={selectedRoom}
/>
```

## 🎯 Integration Examples

### Library Page Integration
```tsx
export default function Library() {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [bookMode, setBookMode] = useState<'create' | 'update' | 'delete'>('create')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedShelfId, setSelectedShelfId] = useState<string>()

  const handleAddBook = (shelfId: string) => {
    setSelectedShelfId(shelfId)
    setBookMode('create')
    setSelectedBook(null)
    setIsBookModalOpen(true)
  }

  const handleEditBook = (book: Book) => {
    setSelectedBook(book)
    setBookMode('update')
    setIsBookModalOpen(true)
  }

  const handleDeleteBook = (book: Book) => {
    setSelectedBook(book)
    setBookMode('delete')
    setIsBookModalOpen(true)
  }

  return (
    <>
      {/* Your library content */}
      <Bookshelf
        onAddBook={handleAddBook}
        onEditBook={handleEditBook}
        onDeleteBook={handleDeleteBook}
      />

      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        mode={bookMode}
        book={selectedBook}
        defaultShelfId={selectedShelfId}
      />
    </>
  )
}
```

### Settings Page Integration
```tsx
export default function Settings() {
  const [isShelfModalOpen, setIsShelfModalOpen] = useState(false)
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
  const [shelfMode, setShelfMode] = useState<'create' | 'update' | 'delete'>('create')
  const [roomMode, setRoomMode] = useState<'create' | 'update' | 'delete'>('create')

  return (
    <>
      {/* Shelf Management */}
      <button onClick={() => {
        setShelfMode('create')
        setIsShelfModalOpen(true)
      }}>
        Add New Shelf
      </button>

      {/* Room Management */}
      <button onClick={() => {
        setRoomMode('create')
        setIsRoomModalOpen(true)
      }}>
        Add New Room
      </button>

      <ShelfModal
        isOpen={isShelfModalOpen}
        onClose={() => setIsShelfModalOpen(false)}
        mode={shelfMode}
        shelf={selectedShelf}
      />

      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        mode={roomMode}
        room={selectedRoom}
      />
    </>
  )
}
```

## 🎨 Customization

### Modal Sizes
```tsx
<Modal
  size="sm"  // Small: max-w-md
  size="md"  // Medium: max-w-lg (default)
  size="lg"  // Large: max-w-2xl
  size="xl"  // Extra Large: max-w-4xl
/>
```

### Custom Styling
Modal menggunakan Tailwind CSS dengan custom colors:
- `text-darkBrown` - Primary text color
- `text-walnut` - Secondary text color
- `bg-walnut` - Primary button color
- `bg-darkBrown` - Hover state

## 🔧 Advanced Features

### 1. Auto-Close on Success
Semua modals otomatis menutup setelah operasi berhasil.

### 2. Form Reset
Form otomatis di-reset setelah modal ditutup atau operasi berhasil.

### 3. Error Handling
API errors ditangani oleh React Query mutation hooks.

### 4. Loading States
Indikator loading muncul saat operasi sedang berjalan.

### 5. Confirmation Dialogs
Delete operations menampilkan konfirmasi dengan preview entity.

## 📝 Best Practices

1. **State Management**
   - Gunakan state yang terpisah untuk setiap modal type
   - Reset state setelah modal close

2. **Mode Management**
   - Selalu tentukan mode yang jelas (create/update/delete)
   - Reset mode ke default setelah operasi selesai

3. **Entity Selection**
   - Clear entity selection setelah modal close
   - Use null checks untuk update/delete modes

4. **User Feedback**
   - Berikan feedback visual untuk loading states
   - Show confirmation untuk destructive actions

## 🚀 Next Steps

1. Integrate modals ke existing pages
2. Add keyboard shortcuts (ESC to close)
3. Add form validation messages
4. Add success notifications
5. Implement bulk operations (optional)

## 📚 API Reference

### BookModal
```tsx
interface BookModalProps {
  isOpen: boolean
  onClose: () => void
  book?: Book | null
  mode?: 'create' | 'update' | 'delete'
  defaultShelfId?: string
}
```

### ShelfModal
```tsx
interface ShelfModalProps {
  isOpen: boolean
  onClose: () => void
  shelf?: Shelf | null
  mode?: 'create' | 'update' | 'delete'
}
```

### CollectionModal
```tsx
interface CollectionModalProps {
  isOpen: boolean
  onClose: () => void
  collection?: Collection | null
  mode?: 'create' | 'update' | 'delete'
}
```

### RoomModal
```tsx
interface RoomModalProps {
  isOpen: boolean
  onClose: () => void
  room?: Room | null
  mode?: 'create' | 'update' | 'delete'
}
```

---

**Status:** ✅ Complete - All modals created and ready for integration!