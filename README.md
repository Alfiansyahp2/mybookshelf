# MyBookshelf 📚

A modern personal library management application with a beautiful 3D bookshelf visualization. 

![MyBookshelf](https://img.shields.io/badge/Laravel-12-red) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8)

## 🌟 Features

- **3D Bookshelf Rendering**: Interactive book spines with realistic perspective and lighting.
- **Library Management**: Organize books into shelves, track reading progress, and manage borrowed books.
- **Personalization**: Decorate your shelves with plants, candles, and pixel art cats.
- **Analytics**: Visualize your reading habits with charts and statistics.
- **Drag & Drop**: Easily reorder and organize your shelves.

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

For detailed technical documentation, API summaries, and system architecture, please refer to the [Developer Guide](DEVELOPER_GUIDE.md).
