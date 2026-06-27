<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MyBookshelf - Your Personal Library</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=playfair+display:400,500,600,700&family=inter:wght@300,400,500,600&display=swap" rel="stylesheet" />

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-[#F8F5F0] text-[#4A3B2F] font-sans antialiased overflow-x-hidden">

    <!-- App Container -->
    <div id="app">

        <!-- Top Navigation -->
        <nav class="fixed top-0 left-0 right-0 z-50 bg-[#F8F5F0]/95 backdrop-blur-sm border-b border-[#4A3B2F]/10">
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <!-- Logo -->
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-[#7A5C42] rounded-lg flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <h1 class="text-xl font-semibold text-[#4A3B2F]" style="font-family: 'Playfair Display', serif;">MyBookshelf</h1>
                    </div>

                    <!-- Search -->
                    <div class="flex-1 max-w-xl mx-8">
                        <div class="relative">
                            <input type="text" placeholder="Search your library..." class="w-full px-4 py-2.5 pl-10 bg-white border border-[#7A5C42]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7A5C42]/30 focus:border-[#7A5C42]/50">
                            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A5C42]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-4">
                        <button class="px-4 py-2.5 bg-[#7A5C42] text-white rounded-xl text-sm font-medium hover:bg-[#5C4532] transition-colors flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Add Book
                        </button>
                        <button class="w-10 h-10 bg-white border border-[#7A5C42]/20 rounded-xl flex items-center justify-center hover:border-[#7A5C42]/40 transition-colors relative">
                            <svg class="w-5 h-5 text-[#7A5C42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                        </button>
                        <button class="w-10 h-10 bg-gradient-to-br from-[#7A5C42] to-[#5C4532] rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                            U
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="pt-24 min-h-screen">

            <!-- Welcome Section -->
            <section class="max-w-7xl mx-auto px-6 mb-12">
                <div class="mb-8">
                    <h2 class="text-3xl font-semibold text-[#4A3B2F] mb-2" style="font-family: 'Playfair Display', serif;">
                        Welcome back.
                    </h2>
                    <p class="text-[#7A5C42]/70 text-lg">Continue building your personal library.</p>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    <div class="bg-white rounded-2xl p-4 border border-[#7A5C42]/10 hover:border-[#7A5C42]/20 transition-colors">
                        <div class="text-2xl mb-1">📚</div>
                        <div class="text-2xl font-semibold text-[#4A3B2F]">247</div>
                        <div class="text-xs text-[#7A5C42]/60">Total Books</div>
                    </div>
                    <div class="bg-white rounded-2xl p-4 border border-[#7A5C42]/10 hover:border-[#7A5C42]/20 transition-colors">
                        <div class="text-2xl mb-1">📖</div>
                        <div class="text-2xl font-semibold text-[#4A3B2F]">183</div>
                        <div class="text-xs text-[#7A5C42]/60">Read</div>
                    </div>
                    <div class="bg-white rounded-2xl p-4 border border-[#7A5C42]/10 hover:border-[#7A5C42]/20 transition-colors">
                        <div class="text-2xl mb-1">📕</div>
                        <div class="text-2xl font-semibold text-[#4A3B2F]">3</div>
                        <div class="text-xs text-[#7A5C42]/60">Reading</div>
                    </div>
                    <div class="bg-white rounded-2xl p-4 border border-[#7A5C42]/10 hover:border-[#7A5C42]/20 transition-colors">
                        <div class="text-2xl mb-1">🟡</div>
                        <div class="text-2xl font-semibold text-[#4A3B2F]">61</div>
                        <div class="text-xs text-[#7A5C42]/60">Unread</div>
                    </div>
                    <div class="bg-white rounded-2xl p-4 border border-[#7A5C42]/10 hover:border-[#7A5C42]/20 transition-colors">
                        <div class="text-2xl mb-1">🛒</div>
                        <div class="text-2xl font-semibold text-[#4A3B2F]">12</div>
                        <div class="text-xs text-[#7A5C42]/60">Wishlist</div>
                    </div>
                    <div class="bg-white rounded-2xl p-4 border border-[#7A5C42]/10 hover:border-[#7A5C42]/20 transition-colors">
                        <div class="text-2xl mb-1">📦</div>
                        <div class="text-2xl font-semibold text-[#4A3B2F]">8</div>
                        <div class="text-xs text-[#7A5C42]/60">Loaned</div>
                    </div>
                    <div class="bg-white rounded-2xl p-4 border border-[#7A5C42]/10 hover:border-[#7A5C42]/20 transition-colors">
                        <div class="text-2xl mb-1">🤝</div>
                        <div class="text-2xl font-semibold text-[#4A3B2F]">2</div>
                        <div class="text-xs text-[#7A5C42]/60">Borrowed</div>
                    </div>
                    <div class="bg-white rounded-2xl p-4 border border-[#7A5C42]/10 hover:border-[#7A5C42]/20 transition-colors">
                        <div class="text-2xl mb-1">❤️</div>
                        <div class="text-2xl font-semibold text-[#4A3B2F]">45</div>
                        <div class="text-xs text-[#7A5C42]/60">Favorites</div>
                    </div>
                </div>
            </section>

            <!-- Virtual Bookshelf -->
            <section class="max-w-7xl mx-auto px-6 pb-16">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-semibold text-[#4A3B2F]" style="font-family: 'Playfair Display', serif;">My Library</h3>
                    <div class="flex items-center gap-3">
                        <button class="px-3 py-1.5 bg-[#7A5C42]/10 text-[#4A3B2F] rounded-lg text-sm hover:bg-[#7A5C42]/20 transition-colors">All</button>
                        <button class="px-3 py-1.5 bg-white border border-[#7A5C42]/20 text-[#4A3B2F] rounded-lg text-sm hover:border-[#7A5C42]/40 transition-colors">Reading</button>
                        <button class="px-3 py-1.5 bg-white border border-[#7A5C42]/20 text-[#4A3B2F] rounded-lg text-sm hover:border-[#7A5C42]/40 transition-colors">Finished</button>
                        <button class="px-3 py-1.5 bg-white border border-[#7A5C42]/20 text-[#4A3B2F] rounded-lg text-sm hover:border-[#7A5C42]/40 transition-colors">Unread</button>
                    </div>
                </div>

                <!-- Bookshelf Container -->
                <div id="bookshelf" class="space-y-1">
                    <!-- Books will be rendered here by JavaScript -->
                </div>

                <!-- Shelf Navigation -->
                <div class="flex items-center justify-center gap-2 mt-8">
                    <button class="w-8 h-8 bg-white border border-[#7A5C42]/20 rounded-lg flex items-center justify-center hover:border-[#7A5C42]/40 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <span class="px-3 py-1.5 bg-[#7A5C42] text-white rounded-lg text-sm">1</span>
                    <span class="px-3 py-1.5 bg-white border border-[#7A5C42]/20 text-[#4A3B2F] rounded-lg text-sm hover:border-[#7A5C42]/40 cursor-pointer">2</span>
                    <span class="px-3 py-1.5 bg-white border border-[#7A5C42]/20 text-[#4A3B2F] rounded-lg text-sm hover:border-[#7A5C42]/40 cursor-pointer">3</span>
                    <span class="text-[#7A5C42]/50">...</span>
                    <button class="w-8 h-8 bg-white border border-[#7A5C42]/20 rounded-lg flex items-center justify-center hover:border-[#7A5C42]/40 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </section>

        </main>

        <!-- Book Detail Modal -->
        <div id="bookDetail" class="fixed inset-0 z-50 hidden">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closeBookDetail()"></div>
            <div class="absolute inset-4 md:inset-12 lg:inset-20 bg-[#F8F5F0] rounded-3xl overflow-hidden shadow-2xl flex">
                <!-- Book detail content will be rendered here -->
            </div>
        </div>

    </div>

</body>
</html>
