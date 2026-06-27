# MyBookshelf 📚

A modern personal library management application with beautiful 3D bookshelf visualization. Built with Laravel 12 (backend) and React 19 + TypeScript (frontend).

![MyBookshelf](https://img.shields.io/badge/Laravel-12-red) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8)

## 🌟 Features

### Visual Experience

- **3D Bookshelf Rendering**: Interactive book spines with realistic perspective transforms and gradients
- **Drag & Drop**: Move books between shelves using `@dnd-kit`
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Custom Theme**: Elegant cream, walnut, dark brown, and gold color palette with Playfair Display & Inter fonts

### Library Management

- **Book Organization**: Categorize books into shelves and rooms with capacity tracking
- **Multiple Book Formats**: Hardcover, paperback, ebook, and audiobook support
- **Reading Progress**: Track reading status (unread, reading, finished, wishlist, borrowed)
- **Collections**: Create themed book groupings with progress tracking
- **Borrowing System**: Track lent and borrowed books with due dates

### Analytics & Insights

- **Reading Statistics**: Comprehensive metrics including reading streaks, pages per year, spending analysis
- **Visual Charts**: Recharts-powered pie, line, bar, area, and scatter charts
- **Achievement System**: Gamification with rarity tiers (common, rare, epic, legendary)
- **Genre & Format Distribution**: Detailed breakdowns of your library

### Additional Features

- **Wishlist**: Keep track of books you want to read
- **Notes & Ratings**: Personal notes and ratings for each book
- **Reading Timeline**: Visual timeline of your reading journey
- **Favorites**: Mark and quickly access favorite books
- **Responsive Design**: Beautiful experience across all devices

## 🏗️ Architecture

MyBookshelf is a decoupled full-stack application:

### Backend (Laravel 12)

- **Framework**: Laravel 12.x with PHP 8.2+
- **Database**: SQLite (default, easily configurable for MySQL/PostgreSQL)
- **API Ready**: Structure prepared for REST API endpoints
- **Authentication**: Laravel's built-in authentication system

### Frontend (React 19 SPA)

- **Framework**: React 19.2 with TypeScript 6.0
- **Build Tool**: Vite 8 for lightning-fast HMR
- **State Management**: Zustand 5 with persistence middleware
- **Data Fetching**: TanStack Query 5 (configured and ready for API integration)
- **Routing**: React Router DOM 7.18
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS 3.4 with custom theme

## 📁 Project Structure

```text
mybookshelf/
├── app/                          # Laravel backend
│   ├── Http/
│   │   └── Controllers/
│   └── Models/
├── config/                       # Laravel configuration
├── database/
│   ├── database.sqlite           # SQLite database
│   ├── migrations/               # Database migrations
│   └── seeders/                  # Database seeders
├── resources/
│   ├── css/                      # Laravel assets
│   ├── js/                       # Laravel assets
│   └── views/                    # Blade templates
├── routes/                       # Laravel routes
├── frontend/                     # React SPA
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/                # Page components
│   │   ├── store/                # Zustand state management
│   │   ├── types/                # TypeScript type definitions
│   │   ├── utils/                # Utilities and mock data
│   │   ├── App.tsx               # Main app component
│   │   └── main.tsx              # Entry point
│   ├── public/                   # Static assets
│   ├── dist/                     # Build output
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── tsconfig.json             # TypeScript configuration
│   └── vite.config.ts            # Vite configuration
├── composer.json                 # PHP dependencies
├── package.json                  # Root npm dependencies
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- **PHP**: 8.2 or higher
- **Composer**: Latest version
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/mybookshelf.git
   cd mybookshelf
   ```

2. **Install Backend Dependencies**

   ```bash
   composer install
   ```

3. **Install Frontend Dependencies**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Configuration**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database Setup**

   ```bash
   # For SQLite (default)
   touch database/database.sqlite

   # Run migrations
   php artisan migrate

   # Seed the database (optional)
   php artisan db:seed
   ```

### Development

Run both backend and frontend development servers:

#### Option 1: Run separately (recommended for development)

```bash
# Terminal 1 - Laravel Backend
php artisan serve

# Terminal 2 - React Frontend
cd frontend
npm run dev
```

#### Option 2: Run everything at once

```bash
composer run dev
```

This will start:

- Laravel server at `http://localhost:8000`
- React dev server at `http://localhost:5173`
- Queue worker
- Log monitoring

### Building for Production

```bash
# Build frontend assets
cd frontend
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🎨 Customization

### Theme Colors

The application uses a custom color palette defined in `frontend/tailwind.config.js`:

```javascript
colors: {
  cream: '#FDF8F3',
  darkBrown: '#3D2914',
  walnut: '#8B6F47',
  gold: '#C9A962',
  beige: '#E8DCC4'
}
```

### Fonts

- **Serif**: Playfair Display (headings)
- **Sans**: Inter (body text)
- **Mono**: JetBrains Mono (code)

## 📊 Data Model

### Core Entities

#### Book

- ISBN, title, author, genre, format
- Spine colors (3-color gradient for 3D rendering)
- Physical dimensions (height, thickness)
- Reading status and progress
- Purchase information and location
- Personal notes and ratings

#### Shelf & Room

- Hierarchical organization
- Capacity and occupancy tracking
- Visual positioning on bookshelf

#### Collection

- Themed book groupings
- Progress tracking

#### Achievement

- Gamification system
- Rarity tiers (common, rare, epic, legendary)

## 🔧 Technology Stack

### Backend

- **Framework**: Laravel 12
- **Database**: SQLite / MySQL / PostgreSQL
- **PHP Version**: 8.2+
- **Build Tools**: Vite 7, Tailwind CSS 4

### Frontend

- **Framework**: React 19.2
- **Language**: TypeScript 6.0
- **Build Tool**: Vite 8
- **State Management**: Zustand 5
- **Data Fetching**: TanStack Query 5
- **Routing**: React Router DOM 7.18
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 12.42
- **Charts**: Recharts 3.9
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React

## 🔮 Roadmap

- [ ] API Integration (connect React frontend to Laravel backend)
- [ ] User Authentication
- [ ] Cloud Sync (backup library to cloud)
- [ ] Barcode Scanner (add books via ISBN)
- [ ] Import/Export (Goodreads, LibraryThing)
- [ ] Mobile App (React Native)
- [ ] Social Features (share libraries, book clubs)
- [ ] Reading Goals and Challenges
- [ ] Book Recommendations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open-sourced software licensed under the MIT license.

## 👤 Author

**Your Name** - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Laravel team for the amazing framework
- React community for the excellent tools
- Design inspiration from beautiful bookshelf interfaces
- All open-source contributors

---

Made with ❤️ for book lovers
