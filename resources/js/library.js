// MyBookshelf - Virtual Library JavaScript
// Mock data and interactivity

// ============================================
// MOCK DATA
// ============================================

const mockBooks = [
    // Currently Reading
    {
        id: 1,
        title: "Atomic Habits",
        author: "James Clear",
        spineColors: ["#2C5F2D", "#97BC62", "#3A6B38"],
        height: "medium",
        thickness: "regular",
        status: "reading",
        startedDate: "2024-05-15",
        currentPage: 156,
        totalPages: 320,
        coverColor: "#2C5F2D",
        genre: "Self-Help",
        isbn: "978-0735211292"
    },
    {
        id: 2,
        title: "Dune",
        author: "Frank Herbert",
        spineColors: ["#C4A35A", "#8B7355", "#D4A574"],
        height: "tall",
        thickness: "thick",
        status: "reading",
        startedDate: "2024-06-01",
        currentPage: 234,
        totalPages: 896,
        coverColor: "#C4A35A",
        genre: "Science Fiction",
        isbn: "978-0441172719"
    },
    {
        id: 3,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        spineColors: ["#1E40AF", "#3B82F6", "#2563EB"],
        height: "short",
        thickness: "thin",
        status: "reading",
        startedDate: "2024-06-10",
        currentPage: 89,
        totalPages: 256,
        coverColor: "#1E40AF",
        genre: "Finance",
        isbn: "978-0857197689"
    },

    // Finished - Favorites
    {
        id: 4,
        title: "1984",
        author: "George Orwell",
        spineColors: ["#1F2937", "#374151", "#4B5563"],
        height: "medium",
        thickness: "regular",
        status: "finished",
        favorite: true,
        finishedDate: "2024-04-20",
        totalPages: 328,
        coverColor: "#1F2937",
        genre: "Dystopian",
        isbn: "978-0451524935"
    },
    {
        id: 5,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        spineColors: ["#7C2D12", "#9A3412", "#C2410C"],
        height: "tall",
        thickness: "regular",
        status: "finished",
        favorite: true,
        finishedDate: "2024-03-15",
        totalPages: 336,
        coverColor: "#7C2D12",
        genre: "Classic",
        isbn: "978-0061120084"
    },
    {
        id: 6,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        spineColors: ["#1E3A5F", "#2E5077", "#3E6B8F"],
        height: "short",
        thickness: "thin",
        status: "finished",
        favorite: true,
        finishedDate: "2024-02-28",
        totalPages: 180,
        coverColor: "#1E3A5F",
        genre: "Classic",
        isbn: "978-0743273565"
    },

    // Finished - Regular
    {
        id: 7,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        spineColors: ["#B45309", "#D97706", "#F59E0B"],
        height: "tall",
        thickness: "thick",
        status: "finished",
        finishedDate: "2024-01-10",
        totalPages: 443,
        coverColor: "#B45309",
        genre: "History",
        isbn: "978-0062316097"
    },
    {
        id: 8,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        spineColors: ["#581C87", "#7C3AED", "#8B5CF6"],
        height: "medium",
        thickness: "regular",
        status: "finished",
        finishedDate: "2023-12-05",
        totalPages: 499,
        coverColor: "#581C87",
        genre: "Psychology",
        isbn: "978-0374533557"
    },

    // Unread
    {
        id: 9,
        title: "Project Hail Mary",
        author: "Andy Weir",
        spineColors: ["#0369A1", "#0EA5E9", "#38BDF8"],
        height: "tall",
        thickness: "regular",
        status: "unread",
        totalPages: 476,
        coverColor: "#0369A1",
        genre: "Science Fiction",
        isbn: "978-0593135204"
    },
    {
        id: 10,
        title: "The Midnight Library",
        author: "Matt Haig",
        spineColors: ["#7E22CE", "#A855F7", "#C084FC"],
        height: "short",
        thickness: "thin",
        status: "unread",
        totalPages: 304,
        coverColor: "#7E22CE",
        genre: "Fiction",
        isbn: "978-0525559474"
    },
    {
        id: 11,
        title: "Educated",
        author: "Tara Westover",
        spineColors: ["#047857", "#10B981", "#34D399"],
        height: "medium",
        thickness: "regular",
        status: "unread",
        totalPages: 352,
        coverColor: "#047857",
        genre: "Memoir",
        isbn: "978-0399590504"
    },
    {
        id: 12,
        title: "The Alchemist",
        author: "Paulo Coelho",
        spineColors: ["#B91C1C", "#EF4444", "#F87171"],
        height: "short",
        thickness: "thin",
        status: "unread",
        totalPages: 208,
        coverColor: "#B91C1C",
        genre: "Fiction",
        isbn: "978-0062315007"
    },

    // Borrowed Out
    {
        id: 13,
        title: "The Subtle Art of Not Giving a F*ck",
        author: "Mark Manson",
        spineColors: ["#DC2626", "#F87171", "#EF4444"],
        height: "medium",
        thickness: "regular",
        status: "borrowed",
        borrowedBy: "John",
        borrowedDate: "2024-06-01",
        dueDate: "2024-07-01",
        totalPages: 224,
        coverColor: "#DC2626",
        genre: "Self-Help",
        isbn: "978-0062457714"
    },

    // More finished books
    {
        id: 14,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        spineColors: ["#92400E", "#B45309", "#D97706"],
        height: "medium",
        thickness: "regular",
        status: "finished",
        finishedDate: "2023-11-20",
        totalPages: 336,
        coverColor: "#92400E",
        genre: "Finance",
        isbn: "978-1612680194"
    },
    {
        id: 15,
        title: "The Four Hour Work Week",
        author: "Tim Ferriss",
        spineColors: ["#065F46", "#10B981", "#34D399"],
        height: "short",
        thickness: "thin",
        status: "finished",
        finishedDate: "2023-10-15",
        totalPages: 416,
        coverColor: "#065F46",
        genre: "Business",
        isbn: "978-0307465131"
    },
    {
        id: 16,
        title: "Deep Work",
        author: "Cal Newport",
        spineColors: ["#1E3A8A", "#3B82F6", "#60A5FA"],
        height: "medium",
        thickness: "regular",
        status: "finished",
        finishedDate: "2023-09-28",
        totalPages: 304,
        coverColor: "#1E3A8A",
        genre: "Productivity",
        isbn: "978-1455586691"
    }
];

const shelves = [
    { id: 1, name: "Shelf A", capacity: 10 },
    { id: 2, name: "Shelf B", capacity: 12 },
    { id: 3, name: "Shelf C", capacity: 8 }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function calculateReadingTime(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    const diff = now - start;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
}

function formatReadingTime(time) {
    return `${time.days} Days ${String(time.hours).padStart(2, '0')} Hours ${String(time.minutes).padStart(2, '0')} Minutes ${String(time.seconds).padStart(2, '0')} Seconds`;
}

function calculateProgress(current, total) {
    return Math.round((current / total) * 100);
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderBook(book) {
    const bookEl = document.createElement('div');
    bookEl.className = `book ${book.height} ${book.thickness} ${book.status}`;
    bookEl.dataset.bookId = book.id;

    const spineEl = document.createElement('div');
    spineEl.className = 'book-spine';
    spineEl.style.setProperty('--spine-color-1', book.spineColors[0]);
    spineEl.style.setProperty('--spine-color-2', book.spineColors[1]);
    spineEl.style.setProperty('--spine-color-3', book.spineColors[2]);

    const titleEl = document.createElement('div');
    titleEl.className = 'book-title';
    titleEl.textContent = book.title;

    spineEl.appendChild(titleEl);
    bookEl.appendChild(spineEl);

    // Add favorite star
    if (book.favorite) {
        bookEl.classList.add('favorite');
    }

    // Add click handler
    bookEl.addEventListener('click', () => openBookDetail(book));

    return bookEl;
}

function renderBorrowedPlaceholder(book) {
    const placeholderEl = document.createElement('div');
    placeholderEl.className = 'borrowed-placeholder';
    placeholderEl.title = `Borrowed by ${book.borrowedBy}\nDue: ${book.dueDate}`;
    return placeholderEl;
}

function renderShelf(shelf, books) {
    const shelfEl = document.createElement('div');
    shelfEl.className = 'bookshelf';

    const booksContainer = document.createElement('div');
    booksContainer.className = 'books-container';

    // Sort books: borrowed first, then by status
    const sortedBooks = [...books].sort((a, b) => {
        if (a.status === 'borrowed' && b.status !== 'borrowed') return -1;
        if (a.status !== 'borrowed' && b.status === 'borrowed') return 1;
        return 0;
    });

    sortedBooks.forEach(book => {
        if (book.status === 'borrowed') {
            booksContainer.appendChild(renderBorrowedPlaceholder(book));
        } else {
            booksContainer.appendChild(renderBook(book));
        }
    });

    const shelfSurface = document.createElement('div');
    shelfSurface.className = 'shelf-surface';

    const shelfInfo = document.createElement('div');
    shelfInfo.className = 'shelf-info';

    const shelfTitle = document.createElement('div');
    shelfTitle.className = 'shelf-title';
    shelfTitle.textContent = shelf.name;

    const occupancy = Math.min((books.length / shelf.capacity) * 100, 100);

    const shelfOccupancy = document.createElement('div');
    shelfOccupancy.className = 'shelf-occupancy';

    const occupancyBar = document.createElement('div');
    occupancyBar.className = 'occupancy-bar';

    const occupancyFill = document.createElement('div');
    occupancyFill.className = 'occupancy-fill';
    occupancyFill.style.width = `${occupancy}%`;

    // Color based on occupancy
    if (occupancy >= 90) {
        occupancyFill.style.background = 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)';
    } else if (occupancy >= 70) {
        occupancyFill.style.background = 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)';
    }

    const occupancyText = document.createElement('div');
    occupancyText.className = 'occupancy-text';
    occupancyText.textContent = `${Math.round(occupancy)}%`;

    occupancyBar.appendChild(occupancyFill);
    shelfOccupancy.appendChild(occupancyBar);
    shelfOccupancy.appendChild(occupancyText);

    shelfInfo.appendChild(shelfTitle);
    shelfInfo.appendChild(shelfOccupancy);

    shelfEl.appendChild(booksContainer);
    shelfEl.appendChild(shelfSurface);
    shelfEl.appendChild(shelfInfo);

    return shelfEl;
}

function renderBookshelf() {
    const bookshelfEl = document.getElementById('bookshelf');
    bookshelfEl.innerHTML = '';

    // Distribute books across shelves
    const booksPerShelf = Math.ceil(mockBooks.length / shelves.length);

    shelves.forEach((shelf, index) => {
        const start = index * booksPerShelf;
        const end = start + booksPerShelf;
        const shelfBooks = mockBooks.slice(start, end);

        bookshelfEl.appendChild(renderShelf(shelf, shelfBooks));
    });
}

// ============================================
// BOOK DETAIL MODAL
// ============================================

function openBookDetail(book) {
    const modal = document.getElementById('bookDetail');
    const modalContent = modal.querySelector('.absolute:nth-child(2)');

    const readingTime = book.status === 'reading' ? calculateReadingTime(book.startedDate) : null;
    const progress = book.status === 'reading' ? calculateProgress(book.currentPage, book.totalPages) : 0;

    modalContent.innerHTML = `
        <div class="flex h-full">
            <!-- Left Page - Book Info -->
            <div class="w-1/2 bg-white p-8 flex flex-col border-r border-[#7A5C42]/10">
                <button onclick="closeBookDetail()" class="self-end mb-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#7A5C42]/10 transition-colors">
                    <svg class="w-5 h-5 text-[#7A5C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <!-- Book Cover Placeholder -->
                <div class="w-48 h-72 mx-auto mb-6 rounded-lg shadow-2xl flex items-center justify-center" style="background: linear-gradient(135deg, ${book.spineColors[0]} 0%, ${book.spineColors[2]} 100%);">
                    <div class="text-white text-center p-4">
                        <div class="text-2xl font-semibold mb-2" style="font-family: 'Playfair Display', serif;">${book.title}</div>
                        <div class="text-sm opacity-90">${book.author}</div>
                    </div>
                </div>

                <div class="space-y-4 text-sm">
                    <div>
                        <div class="text-[#7A5C42]/60 text-xs uppercase tracking-wide mb-1">Author</div>
                        <div class="font-medium text-[#4A3B2F]">${book.author}</div>
                    </div>
                    <div>
                        <div class="text-[#7A5C42]/60 text-xs uppercase tracking-wide mb-1">Genre</div>
                        <div class="font-medium text-[#4A3B2F]">${book.genre}</div>
                    </div>
                    <div>
                        <div class="text-[#7A5C42]/60 text-xs uppercase tracking-wide mb-1">ISBN</div>
                        <div class="font-medium text-[#4A3B2F] font-mono">${book.isbn}</div>
                    </div>
                    <div>
                        <div class="text-[#7A5C42]/60 text-xs uppercase tracking-wide mb-1">Pages</div>
                        <div class="font-medium text-[#4A3B2F]">${book.totalPages}</div>
                    </div>
                </div>
            </div>

            <!-- Right Page - Reading Progress -->
            <div class="w-1/2 bg-[#F8F5F0] p-8 flex flex-col">
                <h2 class="text-2xl font-semibold mb-6" style="font-family: 'Playfair Display', serif;">${book.title}</h2>

                ${book.status === 'reading' ? `
                    <!-- Reading Timer -->
                    <div class="reading-timer mb-6">
                        <div class="text-xs text-[#7A5C42]/60 uppercase tracking-wide mb-2">Reading Since</div>
                        <div class="text-sm font-medium text-[#4A3B2F] mb-4">${new Date(book.startedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>

                        <div class="text-xs text-[#7A5C42]/60 uppercase tracking-wide mb-2">Reading Time</div>
                        <div class="timer-display">${formatReadingTime(readingTime)}</div>
                        <div class="timer-label">Live Timer</div>
                    </div>

                    <!-- Progress -->
                    <div class="mb-6">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm text-[#7A5C42]/60">Progress</span>
                            <span class="text-sm font-medium text-[#4A3B2F]">${progress}%</span>
                        </div>
                        <div class="h-2 bg-white rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-500" style="width: ${progress}%; background: linear-gradient(90deg, ${book.spineColors[0]}, ${book.spineColors[2]});"></div>
                        </div>
                        <div class="flex items-center justify-between mt-2 text-xs text-[#7A5C42]/60">
                            <span>Page ${book.currentPage}</span>
                            <span>of ${book.totalPages}</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-3 mt-auto">
                        <button class="flex-1 py-3 bg-[#7A5C42] text-white rounded-xl font-medium hover:bg-[#5C4532] transition-colors">
                            Continue Reading
                        </button>
                        <button class="px-4 py-3 bg-white border border-[#7A5C42]/20 rounded-xl hover:border-[#7A5C42]/40 transition-colors">
                            <svg class="w-5 h-5 text-[#7A5C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                        </button>
                    </div>
                ` : ''}

                ${book.status === 'finished' ? `
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] flex items-center justify-center text-white">
                            ✓
                        </div>
                        <div>
                            <div class="font-semibold text-[#4A3B2F]">Finished</div>
                            <div class="text-sm text-[#7A5C42]/60">${new Date(book.finishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                    </div>

                    <div class="text-sm text-[#7A5C42]/60 mb-4">
                        You completed this ${book.totalPages}-page journey.
                    </div>

                    ${book.favorite ? `
                        <div class="flex items-center gap-2 text-[#F59E0B] mb-4">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <span class="font-medium">Favorite</span>
                        </div>
                    ` : ''}

                    <div class="flex gap-3 mt-auto">
                        <button class="flex-1 py-3 bg-[#7A5C42] text-white rounded-xl font-medium hover:bg-[#5C4532] transition-colors">
                            Read Again
                        </button>
                        <button class="px-4 py-3 bg-white border border-[#7A5C42]/20 rounded-xl hover:border-[#7A5C42]/40 transition-colors">
                            <svg class="w-5 h-5 text-[#7A5C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                            </svg>
                        </button>
                    </div>
                ` : ''}

                ${book.status === 'unread' ? `
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-12 h-12 rounded-full bg-[#7A5C42]/20 flex items-center justify-center text-[#7A5C42]">
                            📚
                        </div>
                        <div>
                            <div class="font-semibold text-[#4A3B2F]">Not Started</div>
                            <div class="text-sm text-[#7A5C42]/60">${book.totalPages} pages waiting</div>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-auto">
                        <button class="flex-1 py-3 bg-[#7A5C42] text-white rounded-xl font-medium hover:bg-[#5C4532] transition-colors">
                            Start Reading
                        </button>
                        <button class="px-4 py-3 bg-white border border-[#7A5C42]/20 rounded-xl hover:border-[#7A5C42]/40 transition-colors">
                            <svg class="w-5 h-5 text-[#7A5C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                            </svg>
                        </button>
                    </div>
                ` : ''}

                ${book.status === 'borrowed' ? `
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-12 h-12 rounded-full bg-[#EF4444]/20 flex items-center justify-center text-[#EF4444]">
                            📤
                        </div>
                        <div>
                            <div class="font-semibold text-[#4A3B2F]">Loaned Out</div>
                            <div class="text-sm text-[#7A5C42]/60">With ${book.borrowedBy}</div>
                        </div>
                    </div>

                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-[#7A5C42]/60">Borrowed</span>
                            <span class="font-medium text-[#4A3B2F]">${new Date(book.borrowedDate).toLocaleDateString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-[#7A5C42]/60">Due Date</span>
                            <span class="font-medium text-[#4A3B2F]">${new Date(book.dueDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div class="flex gap-3 mt-auto">
                        <button class="flex-1 py-3 bg-[#7A5C42] text-white rounded-xl font-medium hover:bg-[#5C4532] transition-colors">
                            Send Reminder
                        </button>
                        <button class="px-4 py-3 bg-white border border-[#7A5C42]/20 rounded-xl hover:border-[#7A5C42]/40 transition-colors">
                            <svg class="w-5 h-5 text-[#7A5C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                            </svg>
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeBookDetail() {
    const modal = document.getElementById('bookDetail');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// ============================================
// LIVE TIMER UPDATES
// ============================================

function updateLiveTimers() {
    const timerDisplays = document.querySelectorAll('.timer-display');
    timerDisplays.forEach(display => {
        // Find the associated book and update the timer
        // This would be implemented with actual data binding
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    renderBookshelf();

    // Update live timers every second
    setInterval(updateLiveTimers, 1000);
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBookDetail();
    }
});
