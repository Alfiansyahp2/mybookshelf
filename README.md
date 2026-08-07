# MyBookshelf 📚

A modern personal library management application with a beautiful 3D bookshelf visualization. 

![MyBookshelf](https://img.shields.io/badge/Laravel-12-red) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8)

## 🌟 Features

- **3D Bookshelf Rendering**: Interactive book spines with realistic perspective, lighting control, and drag-and-drop customization.
- **Library & Reading Management**: Organize books into custom shelves, manage a wishlist, and track active reading sessions with a built-in timer.
- **Financial Tracking**: Integrated accounting system to log book expenses and manage your reading budget.
- **Gamification & Analytics**: Earn achievements, visualize reading habits with charts, and explore your timeline of activities.
- **Personalization**: Decorate your shelves with plants, candles, pixel art cats, and bookends.

## 🔧 Tech Stack

- **Backend**: Laravel 12, PHP 8.2+, PostgreSQL
- **Frontend**: React 19, TypeScript, Tailwind CSS, Zustand, TanStack Query, Framer Motion


## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/mybookshelf.git
   cd mybookshelf
   
   # Backend Setup
   composer install
   cp .env.example .env
   php artisan key:generate
   touch database/database.sqlite
   php artisan migrate

   # Frontend Setup
   cd frontend
   npm install
   ```

2. **Run Development Servers**
   ```bash
   # Terminal 1 - Backend
   php artisan serve

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 📝 License

This project is open-sourced software licensed under the MIT license.

## 📖 Documentation

MyBookshelf features a comprehensive documentation directory covering user features, technical guidelines, and the project's refactoring history. 

Please refer to the [Documentation Index](docs/INDEX.md) to explore the available guides.
