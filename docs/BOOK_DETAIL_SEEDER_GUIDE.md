# Book Detail Seeder Guide

## Overview

The `BookDetailSeeder` creates detailed book data with rich information that matches the UI components in `BookDetailModal`. Each book includes:

- **Basic metadata**: title, author, ISBN, genre, language, publisher, publish year, pages, format
- **Visual properties**: spine colors (light, medium, dark), height, thickness
- **Reading status**: unread, reading, finished, wishlist, borrowed
- **Progress tracking**: current page, progress percentage, start/finish dates
- **Personal data**: ratings (1-5 stars), personal notes, favorite status
- **Purchase info**: purchase date, price, location
- **Shelf placement**: shelf assignment and position

## Data Structure

Each book entry includes comprehensive information for testing the BookDetailModal UI:

### Example: Currently Reading Book
```php
[
    'title' => 'Atomic Habits',
    'author' => 'James Clear',
    'status' => 'reading',
    'current_page' => 156,
    'progress' => 48.75,
    'personal_rating' => 4.5,
    'personal_notes' => 'Excellent book on building good habits...',
    'favorite' => false,
    // ... more fields
]
```

### Example: Finished Book
```php
[
    'title' => '1984',
    'author' => 'George Orwell',
    'status' => 'finished',
    'progress' => 100.00,
    'personal_rating' => 5.0,
    'personal_notes' => 'Chilling and thought-provoking...',
    'favorite' => true,
    // ... more fields
]
```

### Example: Wishlist Book
```php
[
    'title' => 'Project Hail Mary',
    'author' => 'Andy Weir',
    'status' => 'wishlist',
    'personal_notes' => 'Heard amazing things about this!',
    'purchase_date' => null,  // Not purchased yet
    // ... more fields
]
```

## Usage

### Run All Seeders
```bash
# Run all seeders (includes BookDetailSeeder)
php artisan db:seed

# Or with fresh migration
php artisan migrate:fresh --seed
```

### Run Only Book Detail Seeder
```bash
php artisan db:seed --class=BookDetailSeeder
```

## Book Categories Included

1. **Currently Reading** (3 books)
   - Atomic Habits, Dune, The Psychology of Money
   - Each has progress, start date, personal notes, and ratings

2. **Finished - Favorites** (3 books)
   - 1984, To Kill a Mockingbird, The Great Gatsby
   - All marked as favorite with 5-star ratings

3. **Finished - Regular** (6 books)
   - Sapiens, Thinking Fast and Slow, Rich Dad Poor Dad, etc.
   - Various ratings and completion notes

4. **Unread/Wishlist** (5 books)
   - Project Hail Mary, The Midnight Library, Educated, etc.
   - Personal notes explain why interested

5. **Borrowed** (1 book)
   - The Subtle Art of Not Giving a F*ck
   - Has borrower info and due date

## Personal Notes Content

The seeder includes realistic personal notes that demonstrate different writing styles:

- **Thoughtful analysis**: Multiple paragraphs with key insights
- **Key takeaways**: Bullet points of main lessons
- **Reading progress**: Current thoughts while reading
- **Recommendations**: Why the book is worth reading
- **Quotes**: Marked with quotation marks for emphasis

## Rating Distribution

Books have varied personal ratings (0.0 - 5.0):
- 5.0 stars: 4 books (masterpieces)
- 4.5 stars: 4 books (excellent)
- 4.0 stars: 3 books (very good)
- 3.5 stars: 3 books (good)
- 3.0 stars: 2 books (okay)
- Unrated: 5 books (not read yet)

## Color Schemes

Each book has a 3-color gradient for the spine:
- Various palettes: blues, greens, browns, reds, purples
- Creates visually appealing 3D book covers
- Safe defaults: `['#8B7355', '#6B5344', '#5C4532']` (brown tones)

## Testing UI Components

Use these books to test different BookDetailModal states:

| Status | Use Case | Book Example |
|--------|----------|--------------|
| `reading` | Progress slider, reading stats | Atomic Habits (48.75%) |
| `finished` | Completion data, full notes | 1984 (100%) |
| `wishlist` | No purchase info, anticipation | Project Hail Mary |
| `unread` | Purchased but not started | Educated |
| `borrowed` | Borrower tracking | The Subtle Art... |
| `favorite` | Heart icon, favorite filter | Dune |
| `rated` | Star rating display | All finished books |
| `notes` | Notes editor, display | Books with long notes |

## File Locations

- **Seeder**: `database/seeders/BookDetailSeeder.php`
- **Model**: `app/Models/Book.php`
- **Modal**: `frontend/src/components/modals/BookDetailModal.tsx`
- **Migration**: `database/migrations/2026_06_27_190642_create_books_table.php`

## Customization

To add more books or modify existing ones, edit the `$books` array in `BookDetailSeeder.php`. Each book should follow the same structure with all required fields.

## Troubleshooting

**Error: "No user found"**
- Ensure `UserSeeder` runs before `BookDetailSeeder`
- Check that a user exists in the database

**Error: "No shelf found"**
- Ensure `ShelfSeeder` runs before `BookDetailSeeder`
- Verify shelves exist in the database

**Books not appearing**
- Check that user_id matches your user
- Verify shelf_id matches existing shelves
- Run `php artisan db:seed --class=BookDetailSeeder` again

## Data Integrity

The seeder creates:
- 18 books with detailed information
- Multiple book statuses for comprehensive testing
- Realistic personal notes that add value
- Proper relationships with users and shelves
- Valid data for all BookDetailModal UI components