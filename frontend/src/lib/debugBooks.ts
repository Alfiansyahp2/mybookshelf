// Debug utility to check books data
// Run this in browser console: import('/src/lib/debugBooks.ts').then(m => m.debugBooks())

import { booksApi } from './api/books';

export async function debugBooks() {
  console.log('🔍 Debugging Books Data...');

  try {
    // 1. Check user session (no tokens needed for SPA auth)
    const userData = localStorage.getItem('user');
    console.log('👤 User Data:', userData ? 'Found' : 'None');

    if (!userData) {
      console.error('❌ No user data found! Please login first.');
      return;
    }

    // 2. Fetch books
    console.log('📚 Fetching books from API...');
    const response = await booksApi.getBooks();
    console.log('✅ API Response received:', response);

    // 3. Check books data
    const books = response.data?.data || response.data;
    console.log(`📖 Found ${books.length} books`);

    if (books.length === 0) {
      console.warn('⚠️ No books found!');
      return;
    }

    // 4. Check first book details
    const firstBook = books[0];
    console.log('🎯 First Book Sample:', {
      title: firstBook.title,
      author: firstBook.author,
      pages: firstBook.pages,
      status: firstBook.status,
      personal_rating: firstBook.personalRating,
      personal_notes: firstBook.personalNotes,
      spine_colors: firstBook.spineColors,
      publish_year: firstBook.publishYear
    });

    // 5. Check all books for personal data
    const booksWithNotes = books.filter((b: any) => b.personalNotes);
    const booksWithRating = books.filter((b: any) => b.personalRating);

    console.log(`📝 Books with personal notes: ${booksWithNotes.length}/${books.length}`);
    console.log('📝 Books with notes:', booksWithNotes.map((b: any) => b.title));

    console.log(`⭐ Books with ratings: ${booksWithRating.length}/${books.length}`);
    console.log('⭐ Books with ratings:', booksWithRating.map((b: any) => `${b.title} (${b.personalRating}★)`));

    // 6. Check books by status
    const byStatus = books.reduce((acc: any, book: any) => {
      acc[book.status] = (acc[book.status] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Books by status:', byStatus);

    // 7. Return data for inspection
    return {
      total: books.length,
      withNotes: booksWithNotes.length,
      withRating: booksWithRating.length,
      byStatus,
      sampleBook: firstBook,
      allBooks: books
    };

  } catch (error) {
    console.error('❌ Error debugging books:', error);
    throw error;
  }
}

// Auto-run if this file is imported
console.log('💡 Debug utility loaded! Run: debugBooks()');
