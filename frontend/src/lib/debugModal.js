// Copy-paste this code into browser console to debug modal data flow

(async function debugModalData() {
  console.log('🔍 Debugging Modal Data Flow...');

  try {
    // 1. Check if we have user session (SPA auth uses cookies, not tokens)
    const userData = localStorage.getItem('user');
    if (!userData) {
      console.error('❌ No user session found! Please login first.');
      return;
    }

    // 2. Get books from API (cookies are sent automatically)
    const response = await fetch('http://127.0.0.1:8000/api/v1/books', {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Important for SPA auth with cookies
    });

    const apiResponse = await response.json();
    const books = apiResponse.data?.data || apiResponse.data;

    console.log(`📚 Found ${books.length} books from API`);

    if (books.length === 0) {
      console.warn('⚠️ No books found!');
      return;
    }

    // 3. Get first book ID
    const firstBook = books[0];
    console.log('🎯 First book from list:', {
      id: firstBook.id,
      title: firstBook.title,
      pages: firstBook.pages,
      status: firstBook.status,
      rating: firstBook.personal_rating,
      has_notes: !!firstBook.personal_notes
    });

    // 4. Try to get single book by ID (like the modal does)
    console.log(`📡 Fetching single book by ID: ${firstBook.id}...`);
    const singleBookResponse = await fetch(`http://127.0.0.1:8000/api/v1/books/${firstBook.id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Important for SPA auth with cookies
    });

    const singleBookApi = await singleBookResponse.json();
    console.log('Single book API response:', singleBookApi);

    // 5. Extract actual book data from response
    const bookData = singleBookApi.data?.data || singleBookApi.data;
    console.log('Extracted book data:', bookData);

    // 6. Check if transformation would work
    console.log('📝 Book data fields:', {
      title: bookData?.title,
      pages: bookData?.pages,
      status: bookData?.status,
      personal_notes: bookData?.personal_notes?.substring(0, 50) || 'None',
      personal_rating: bookData?.personal_rating,
      publish_year: bookData?.publish_year
    });

    // 7. Check what the frontend expects vs what we get
    console.log('🔍 Field Mapping Check:');
    console.log('  API field → Frontend field');
    console.log('  personal_notes → personalNotes:', bookData?.personal_notes);
    console.log('  personal_rating → personalRating:', bookData?.personal_rating);
    console.log('  publish_year → publishYear:', bookData?.publish_year);
    console.log('  spine_color_light → spineColors[0]:', bookData?.spine_color_light);

    // 8. Test transformBook function manually
    const transformed = {
      id: bookData?.id,
      title: bookData?.title,
      author: bookData?.author,
      pages: bookData?.pages,
      status: bookData?.status,
      personalNotes: bookData?.personal_notes,
      personalRating: bookData?.personal_rating,
      publishYear: bookData?.publish_year,
      spineColors: [bookData?.spine_color_light, bookData?.spine_color_medium, bookData?.spine_color_dark]
    };

    console.log('✅ Manually transformed book:', transformed);
    console.log('📊 This is what the modal should receive');

    console.log('✅ Debug complete! If you see data above but modal shows empty, the issue is in how the modal receives the data.');

  } catch (error) {
    console.error('❌ Debug error:', error);
  }
})();
