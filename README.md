# MyBookshelf 📚

A personal library management web application featuring interactive 3D bookshelf visualization, reading session tracking, and book expense budgeting.

![Laravel](https://img.shields.io/badge/Laravel-12-red) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8)

## 🌟 Features

- **3D Bookshelf Visualization**: Interactive book spines with perspective depth, shelf lighting presets, and drag-and-drop customization.
- **Library & Reading Management**: Organize books across custom shelves and collections, manage wishlists and loans, and track reading sessions with a built-in timer.
- **Financial Tracking**: Log book purchases, monitor budgets across categories and currencies, and export accounting summaries.
- **Gamification & Analytics**: Earn achievements, visualize reading statistics, and explore activity timelines.
- **Personalization & Localization**: Decorate shelves with visual accents and switch between English and Indonesian interfaces.

## 🔧 Tech Stack

- **Backend**: Laravel 12, PHP 8.2+, PostgreSQL 15+, Laravel Sanctum
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, Framer Motion, Recharts

## 🚀 Quick Start

### Prerequisites

- PHP 8.2+ & Composer
- Node.js 20+ & npm
- PostgreSQL 15+

### Setup

1. **Clone the repository & install dependencies**
   ```bash
   git clone <repository-url>
   cd mybookshelf

   composer install
   npm --prefix frontend install
   ```

2. **Configure environment & database**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Create an empty PostgreSQL database, configure the database connection and application URL in `.env`, then run migrations:
   ```bash
   php artisan migrate
   ```
   *(Optional, for local sample data)*:
   ```bash
   php artisan db:seed
   ```

3. **Run development servers**
   ```bash
   # Start backend, queue listener, log stream, and Vite dev server together
   composer dev
   ```
   Or run the backend and frontend servers separately:
   ```bash
   php artisan serve
   npm --prefix frontend run dev
   ```

## 📖 Documentation

- [Documentation Index](docs/INDEX.md) — Architecture overview, API & database specifications, and feature guides.
- [Operational Commands Guide](docs/technical/Operational_Commands_Guide.md) — CLI reference for OpenAPI/TypeScript generation, queues, scheduler, testing, linting, and migrations.

## 📝 License

This project is open-sourced software licensed under the MIT license.
