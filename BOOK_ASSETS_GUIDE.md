# 📚 Book Assets Component Library

Kumpulan komponen visual untuk menampilkan buku dengan berbagai style dan ukuran.

## 🎨 Components Created

### 1. **BookCover** - Realistic 3D Book Cover
**File:** `components/assets/BookCover.tsx`

Cover buku 3D dengan efek hover dan tilt yang realistis.

#### Features:
- ✅ 3D perspective dengan tilt effect pada hover
- ✅ Multiple sizes (sm, md, lg, xl)
- ✅ Spine dengan text vertikal
- ✅ Shine effect dan realistic shadows
- ✅ Quick action buttons (favorite, share)
- ✅ Fully customizable colors dari book data

#### Usage:
```tsx
import BookCover from './components/assets/BookCover'

// Basic usage
<BookCover
  book={myBook}
  size="md"
  onClick={() => console.log('Book clicked')}
/>

// With options
<BookCover
  book={myBook}
  size="lg"
  showSpine={true}
  interactive={true}
  onClick={() => handleBookClick(myBook)}
/>
```

#### Props:
```tsx
interface BookCoverProps {
  book: Book                  // Book object dengan spineColors
  size?: 'sm' | 'md' | 'lg' | 'xl'  // Size: 96px to 256px height
  showSpine?: boolean         // Show/hide spine (default: true)
  interactive?: boolean        // Enable hover effects (default: true)
  onClick?: () => void        // Click handler
}
```

---

### 2. **BookDetailCard** - Comprehensive Book Card
**File:** `components/assets/BookDetailCard.tsx`

Card lengkap dengan cover 3D, metadata, progress, dan action buttons.

#### Features:
- ✅ Large 3D book cover dengan realistic shadows
- ✅ Quick stats (pages, year, rating)
- ✅ Interactive rating system (5 stars)
- ✅ Reading progress bar
- ✅ Complete metadata display
- ✅ Personal notes dan purchase info
- ✅ Favorite dan share buttons

#### Usage:
```tsx
import BookDetailCard from './components/assets/BookDetailCard'

<BookDetailCard
  book={myBook}
  showActions={true}
  onFavorite={() => handleFavorite(myBook.id)}
  onShare={() => handleShare(myBook)}
  onRate={(rating) => handleRate(myBook.id, rating)}
/>
```

#### Props:
```tsx
interface BookDetailCardProps {
  book: Book
  showActions?: boolean      // Show action buttons (default: true)
  onFavorite?: () => void    // Favorite click handler
  onShare?: () => void       // Share click handler
  onRate?: (rating: number) => void  // Rating change handler
}
```

---

### 3. **BookStack** - Stacked Books View
**File:** `components/assets/BookStack.tsx`

Tampilan buku dalam stack (bertumpuk) dengan animasi hover.

#### Features:
- ✅ Realistic stack effect dengan layered books
- ✅ Hover animation untuk melihat buku di stack
- ✅ Tooltips dengan book info
- ✅ Adjustable max visible books
- ✅ Multiple sizes

#### Usage:
```tsx
import BookStack from './components/assets/BookStack'

<BookStack
  books={myBooks}
  maxVisible={5}
  size="md"
  onBookClick={(book) => handleBookClick(book)}
/>
```

#### Props:
```tsx
interface BookStackProps {
  books: Book[]                    // Array of books
  maxVisible?: number              // Max books in stack (default: 5)
  size?: 'sm' | 'md' | 'lg'        // Book size (default: md)
  interactive?: boolean            // Enable hover (default: true)
  onBookClick?: (book: Book) => void
}
```

---

### 4. **BookGridView** - Grid Book Display
**File:** `components/assets/BookGridView.tsx`

Grid layout untuk menampilkan banyak buku dengan hover cards.

#### Features:
- ✅ Responsive grid (2-5 columns)
- ✅ 3D book effect dengan shadows
- ✅ Hover info card dengan details
- ✅ Progress bar untuk reading books
- ✅ Status badges
- ✅ Quick stats display
- ✅ Filterable by status

#### Usage:
```tsx
import BookGridView from './components/assets/BookGridView'

// All books in 4 columns
<BookGridView
  books={allBooks}
  columns={4}
  onBookClick={(book) => navigate(`/books/${book.id}`)}
/>

// Reading books only with progress
<BookGridView
  books={allBooks}
  filterStatus="reading"
  columns={3}
  showProgress={true}
  onBookClick={(book) => openBookDetail(book)}
/>
```

#### Props:
```tsx
interface BookGridViewProps {
  books: Book[]
  filterStatus?: BookStatus      // Filter by status
  columns?: 2 | 3 | 4 | 5       // Grid columns (default: 4)
  onBookClick?: (book: Book) => void
  showProgress?: boolean         // Show reading progress (default: true)
}
```

---

### 5. **BookshelfView** - Realistic Bookshelf
**File:** `components/assets/BookshelfView.tsx`

Tampilan buku di rak kayu yang realistis dengan wood grain texture.

#### Features:
- ✅ Realistic wooden shelf dengan texture
- ✅ Books displayed standing on shelf
- ✅ Status indicators pada spines
- ✅ Hover actions (edit, delete)
- ✅ Quick info tooltips
- ✅ Customizable shelf color
- ✅ Empty slots untuk visual balance
- ✅ Proper shadows dan depth

#### Usage:
```tsx
import BookshelfView from './components/assets/BookshelfView'

<BookshelfView
  books={shelfBooks}
  shelfName="Living Room Shelf"
  shelfColor="#8B7355"
  onBookClick={(book) => openBookDetail(book)}
  onBookEdit={(book) => openEditModal(book)}
  onBookDelete={(book) => confirmDelete(book)}
/>
```

#### Props:
```tsx
interface BookshelfViewProps {
  books: Book[]                      // Books on this shelf
  shelfName?: string                 // Shelf label (default: "My Bookshelf")
  shelfColor?: string                // Wood color hex (default: "#8B7355")
  onBookClick?: (book: Book) => void
  onBookEdit?: (book: Book) => void
  onBookDelete?: (book: Book) => void
}
```

---

## 🎯 Use Cases & Examples

### 1. **Library Page - Grid View**
```tsx
import BookGridView from './components/assets/BookGridView'

export default function Library() {
  const { data: books } = useBooks()

  return (
    <div className="p-6">
      <BookGridView
        books={books?.data?.data || []}
        columns={4}
        onBookClick={(book) => setSelectedBook(book)}
      />
    </div>
  )
}
```

### 2. **Book Detail Page - Detail Card**
```tsx
import BookDetailCard from './components/assets/BookDetailCard'

export default function BookDetail({ bookId }) {
  const { data: book } = useBook(bookId)

  return (
    <div className="p-8">
      <BookDetailCard
        book={book}
        onFavorite={() => toggleFavorite(book.id)}
        onRate={(rating) => rateBook(book.id, rating)}
      />
    </div>
  )
}
```

### 3. **Reading Page - Progress Focus**
```tsx
import BookGridView from './components/assets/BookGridView'

export default function Reading() {
  const { data: books } = useBooks({ status: 'reading' })

  return (
    <div className="p-6">
      <BookGridView
        books={books?.data?.data || []}
        filterStatus="reading"
        columns={3}
        showProgress={true}
      />
    </div>
  )
}
```

### 4. **Shelf Management - Realistic View**
```tsx
import BookshelfView from './components/assets/BookshelfView'

export default function ShelfDetail({ shelf }) {
  const shelfBooks = books.filter(b => b.shelfId === shelf.id)

  return (
    <div className="p-6">
      <BookshelfView
        books={shelfBooks}
        shelfName={shelf.name}
        shelfColor="#8B7355"
        onBookEdit={(book) => openEditModal(book)}
      />
    </div>
  )
}
```

### 5. **Wishlist/Stack View**
```tsx
import BookStack from './components/assets/BookStack'

export default function Wishlist() {
  const { data: wishlistBooks } = useBooks({ status: 'wishlist' })

  return (
    <div className="p-6">
      <BookStack
        books={wishlistBooks?.data?.data || []}
        maxVisible={8}
        size="lg"
        onBookClick={(book) => navigate(`/books/${book.id}`)}
      />
    </div>
  )
}
```

---

## 🎨 Customization Guide

### Color Customization
Semua komponen menggunakan `book.spineColors` array untuk warna:
```tsx
// Book object structure
{
  spineColors: ['#8B7355', '#6B5344', '#5C4532']  // [light, medium, dark]
}
```

### Size Options
Berbagai size tersedia untuk komponen yang mendukung:
- **sm**: Compact, untuk grid yang padat
- **md**: Standard, balanced size
- **lg**: Large, untuk featured books
- **xl**: Extra large, untuk hero sections

### Shelf Colors
Custom wood colors untuk BookshelfView:
```tsx
// Light wood
shelfColor="#D4A574"

// Dark walnut
shelfColor="#5C4033"

// Oak
shelfColor="#8B7355"

// Cherry
shelfColor="#A0522D"
```

---

## 🚀 Advanced Features

### 1. **Hover Effects**
Semua komponen memiliki smooth hover transitions:
- 3D perspective shifts
- Shadow expansions
- Scale transforms
- Info card animations

### 2. **Interactive Elements**
- Click handlers untuk navigation
- Quick action buttons
- Rating systems
- Edit/delete actions

### 3. **Responsive Design**
- Grid yang menyesuaikan screen size
- Scalable book sizes
- Mobile-friendly interactions

### 4. **Performance Optimized**
- React.memo ready
- Efficient state management
- Minimal re-renders
- Smooth 60fps animations

---

## 📊 Component Comparison

| Component | Best For | Grid Support | Realism | Interactivity |
|-----------|----------|--------------|----------|---------------|
| **BookCover** | Hero sections, single book focus | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **BookDetailCard** | Book detail pages | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **BookStack** | Wishlist, to-read lists | ❌ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **BookGridView** | Library, collections | ✅ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **BookshelfView** | Shelf management, realistic view | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 💡 Pro Tips

1. **Choose Right Component**:
   - Use `BookGridView` untuk large collections
   - Use `BookshelfView` untuk realistic shelf organization
   - Use `BookStack` untuk stacked/tbr piles
   - Use `BookDetailCard` untuk single book focus

2. **Color Consistency**:
   - Gunakan consistent spine colors untuk series
   - Match shelf colors dengan room themes

3. **Performance**:
   - Limit BookGridView to 20-30 books per view
   - Use pagination untuk large libraries
   - Memoize click handlers

4. **Accessibility**:
   - All components support keyboard navigation
   - Proper aria labels pada interactive elements
   - High contrast ratios maintained

---

## 🎯 Quick Start

```tsx
// 1. Import components
import BookGridView from './components/assets/BookGridView'
import BookDetailCard from './components/assets/BookDetailCard'
import BookshelfView from './components/assets/BookshelfView'

// 2. Use in your components
<BookGridView books={books} columns={4} onBookClick={handleClick} />
<BookDetailCard book={book} onRate={handleRating} />
<BookshelfView books={books} shelfName="My Favorites" />

// 3. Customize with props
<BookGridView
  books={books}
  filterStatus="reading"
  columns={3}
  showProgress={true}
/>

// 4. Handle interactions
const handleBookClick = (book: Book) => {
  navigate(`/books/${book.id}`)
}
```

---

**Status:** ✅ Complete - All book asset components created and ready to use!
