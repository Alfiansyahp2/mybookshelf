import { apiClient } from '../apiClient';
import type { Book, BookStatus } from '../../types';

// API Response types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Raw API Book type (snake_case from Laravel)
interface RawBook {
  id: string;
  user_id: string;
  shelf_id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  language: string;
  publisher: string;
  publish_year: number;
  pages: number;
  format: string;
  height: string;
  thickness: string;
  status: string;
  spine_color_light: string;
  spine_color_medium: string;
  spine_color_dark: string;
  cover_image: string | null;
  position: number;
  favorite: boolean;
  current_page: number | null;
  progress: string;
  started_date: string | null;
  finished_date: string | null;
  estimated_start_date: string | null;
  borrowed_by: string | null;
  borrowed_date: string | null;
  due_date: string | null;
  is_returned: boolean;
  personal_notes: string | null;
  personal_rating: number | null;
  purchase_date: string | null;
  purchase_price: string | null;
  purchase_location: string | null;
  date_added: string;
  last_modified: string;
  deleted_at: string | null;
  shelf: any;
  collections: any[];
}

// Transform raw API book to frontend Book type
export function transformBook(raw: RawBook): Book {
  return {
    id: raw.id,
    title: raw.title,
    author: raw.author,
    isbn: raw.isbn,
    genre: raw.genre,
    language: raw.language,
    publisher: raw.publisher,
    publishYear: raw.publish_year,
    pages: raw.pages,
    format: raw.format as Book['format'],
    spineColors: [raw.spine_color_light, raw.spine_color_medium, raw.spine_color_dark] as [string, string, string],
    height: raw.height as Book['height'],
    thickness: raw.thickness as Book['thickness'],
    coverImage: raw.cover_image || undefined,
    status: raw.status as BookStatus,
    favorite: raw.favorite,
    isFavorite: raw.favorite,
    currentPage: raw.current_page || undefined,
    progress: parseFloat(raw.progress) || 0,
    startedDate: raw.started_date || undefined,
    finishedDate: raw.finished_date || undefined,
    estimatedStartDate: raw.estimated_start_date || undefined,
    readDates: raw.read_dates || [],
    borrowedBy: raw.borrowed_by || undefined,
    borrowedDate: raw.borrowed_date || undefined,
    dueDate: raw.due_date || undefined,
    isReturned: raw.is_returned,
    personalNotes: raw.personal_notes || undefined,
    personalRating: raw.personal_rating || undefined,
    purchaseDate: raw.purchase_date || undefined,
    purchasePrice: raw.purchase_price ? parseFloat(raw.purchase_price) : undefined,
    purchaseCurrency: raw.purchase_currency || undefined,
    isGift: raw.is_gift || false,
    purchaseLocation: raw.purchase_location || undefined,
    shelfId: raw.shelf_id,
    position: raw.position,
    dateAdded: raw.date_added,
    lastModified: raw.last_modified
  };
}

// Books API
export const booksApi = {
  /**
   * Get all books with optional filters
   */
  async getBooks(filters?: {
    status?: BookStatus;
    favorite?: boolean;
    search?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.favorite !== undefined) params.append('favorite', String(filters.favorite));
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = `/v1/books${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get(url);

    console.log('Books API response:', response);

    // Handle paginated response from Laravel
    const booksData = response.data?.data || response.data || [];

    // Transform books array
    return {
      data: {
        data: booksData.map(transformBook),
        meta: {
          total: response.data?.total || response.total || 0,
          per_page: response.data?.per_page || response.per_page || 15,
          current_page: response.data?.current_page || response.current_page || 1,
          last_page: response.data?.last_page || response.last_page || 1,
          from: response.data?.from || response.from,
          to: response.data?.to || response.to
        }
      }
    };
  },

  /**
   * Get a single book by ID
   */
  async getBook(id: string): Promise<ApiResponse<Book>> {
    const response = await apiClient.get(`/v1/books/${id}`);
    // Handle Laravel API response structure: { success, message, data }
    const bookData = response.data?.data || response.data;
    return {
      success: true,
      message: 'Book retrieved successfully',
      data: transformBook(bookData)
    };
  },

  /**
   * Create a new book
   */
  async createBook(bookData: Partial<Book>): Promise<ApiResponse<Book>> {
    // Transform to API format (camelCase to snake_case)
    const apiData: any = {
      title: bookData.title,
      author: bookData.author,
      shelf_id: bookData.shelfId,
      isbn: bookData.isbn,
      genre: bookData.genre,
      language: bookData.language,
      publisher: bookData.publisher,
      publish_year: bookData.publishYear,
      pages: bookData.pages,
      format: bookData.format,
      height: bookData.height,
      thickness: bookData.thickness,
      spine_color_light: bookData.spineColors?.[0],
      spine_color_medium: bookData.spineColors?.[1],
      spine_color_dark: bookData.spineColors?.[2],
      status: bookData.status || 'unread',
      favorite: false,
      cover_image: bookData.coverImage,
      position: bookData.position || 0,
      // Purchase information
      purchase_date: bookData.purchaseDate || null,
      purchase_price: bookData.purchasePrice ?? null,
      purchase_currency: bookData.purchaseCurrency || 'IDR',
      is_gift: bookData.isGift || false,
      purchase_location: bookData.purchaseLocation || null,
      // Reading info
      started_date: bookData.startedDate || null,
      finished_date: bookData.finishedDate || null,
      // Personal info
      personal_notes: bookData.personalNotes || null,
    };

    const response = await apiClient.post('/v1/books', apiData);
    return {
      success: true,
      message: 'Book created successfully',
      data: transformBook(response.data?.data || response.data)
    };
  },

  /**
   * Update a book
   */
  async updateBook(id: string, updates: Partial<Book>): Promise<ApiResponse<Book>> {
    // Transform to API format
    const apiData: any = {};
    if (updates.title) apiData.title = updates.title;
    if (updates.author) apiData.author = updates.author;
    if (updates.isbn) apiData.isbn = updates.isbn;
    if (updates.genre) apiData.genre = updates.genre;
    if (updates.language) apiData.language = updates.language;
    if (updates.publisher !== undefined) apiData.publisher = updates.publisher;
    if (updates.publishYear) apiData.publish_year = updates.publishYear;
    if (updates.pages) apiData.pages = updates.pages;
    if (updates.format) apiData.format = updates.format;
    if (updates.height) apiData.height = updates.height;
    if (updates.thickness) apiData.thickness = updates.thickness;
    if (updates.status) apiData.status = updates.status;
    if (updates.isFavorite !== undefined) apiData.favorite = updates.isFavorite;
    if (updates.currentPage !== undefined) apiData.current_page = updates.currentPage;
    if (updates.personalNotes !== undefined) apiData.personal_notes = updates.personalNotes;
    if (updates.personalRating !== undefined) apiData.personal_rating = updates.personalRating;
    if (updates.borrowedBy !== undefined) apiData.borrowed_by = updates.borrowedBy || null;
    if (updates.borrowedDate !== undefined) apiData.borrowed_date = updates.borrowedDate || null;
    if (updates.dueDate !== undefined) apiData.due_date = updates.dueDate || null;
    if (updates.shelfId !== undefined) apiData.shelf_id = updates.shelfId;
    if (updates.readDates) apiData.read_dates = updates.readDates;
    if (updates.startedDate !== undefined) apiData.started_date = updates.startedDate || null;
    if (updates.finishedDate !== undefined) apiData.finished_date = updates.finishedDate || null;
    // Purchase information
    if (updates.purchaseDate !== undefined) apiData.purchase_date = updates.purchaseDate || null;
    if (updates.purchasePrice !== undefined) apiData.purchase_price = updates.purchasePrice ?? null;
    if (updates.purchaseCurrency !== undefined) apiData.purchase_currency = updates.purchaseCurrency;
    if (updates.isGift !== undefined) apiData.is_gift = updates.isGift;
    if (updates.purchaseLocation !== undefined) apiData.purchase_location = updates.purchaseLocation || null;
    // Spine colors
    if (updates.spineColors) {
      apiData.spine_color_light = updates.spineColors[0];
      apiData.spine_color_medium = updates.spineColors[1];
      apiData.spine_color_dark = updates.spineColors[2];
    }

    const response = await apiClient.patch(`/v1/books/${id}`, apiData);
    return {
      success: true,
      message: 'Book updated successfully',
      data: transformBook(response.data?.data || response.data)
    };
  },

  /**
   * Delete a book (soft delete)
   */
  async deleteBook(id: string): Promise<ApiResponse<null>> {
    await apiClient.delete(`/v1/books/${id}`);
    return {
      success: true,
      message: 'Book deleted successfully',
      data: null
    };
  },

  /**
   * Start reading a book
   */
  async startReading(id: string): Promise<ApiResponse<Book>> {
    const response = await apiClient.post(`/v1/books/${id}/start`);
    return {
      success: true,
      message: 'Started reading successfully',
      data: transformBook(response.data?.data || response.data)
    };
  },

  /**
   * Finish reading a book
   */
  async finishReading(id: string): Promise<ApiResponse<Book>> {
    const response = await apiClient.post(`/v1/books/${id}/finish`);
    return {
      success: true,
      message: 'Finished reading successfully',
      data: transformBook(response.data?.data || response.data)
    };
  },

  /**
   * Upload cover image for a book
   */
  async uploadCover(id: string, file: File): Promise<{ cover_image: string }> {
    const formData = new FormData();
    formData.append('cover', file);
    
    // Get CSRF token
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    const csrfToken = match ? decodeURIComponent(match[1]) : '';
    
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    
    const response = await fetch(`${API_BASE_URL}/v1/books/${id}/cover`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': csrfToken
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
       const errorData = await response.json().catch(() => ({}));
       throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || data;
  },

  /**
   * Update reading progress
   */
  async updateProgress(id: string, currentPage: number): Promise<ApiResponse<Book>> {
    const response = await apiClient.patch(`/v1/books/${id}/progress`, { current_page: currentPage });
    return {
      success: true,
      message: 'Progress updated successfully',
      data: transformBook(response.data?.data || response.data)
    };
  },

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<ApiResponse<Book>> {
    const response = await apiClient.patch(`/v1/books/${id}/favorite`);
    return {
      success: true,
      message: 'Favorite toggled successfully',
      data: transformBook(response.data?.data || response.data)
    };
  },

  /**
   * Update personal notes
   */
  async updateNotes(id: string, notes: string): Promise<ApiResponse<Book>> {
    const response = await apiClient.patch(`/v1/books/${id}/notes`, { notes });
    return {
      success: true,
      message: 'Notes updated successfully',
      data: transformBook(response.data?.data || response.data)
    };
  },

  /**
   * Update personal rating
   */
  async updateRating(id: string, rating: number): Promise<ApiResponse<Book>> {
    const response = await apiClient.patch(`/v1/books/${id}/rating`, { rating });
    return {
      success: true,
      message: 'Rating updated successfully',
      data: transformBook(response.data?.data || response.data)
    };
  },

  /**
   * Move book to different shelf
   */
  async moveToShelf(id: string, shelfId: string, position?: number): Promise<ApiResponse<Book>> {
    const response = await apiClient.patch(`/v1/books/${id}/shelf`, { shelf_id: shelfId, position });
    return {
      success: true,
      message: 'Book moved successfully',
      data: transformBook(response.data?.data || response.data)
    };
  },

  /**
   * Borrow book to someone
   */
  async borrowBook(id: string, borrowedBy: string, dueDate: string): Promise<ApiResponse<Book>> {
    const response = await apiClient.post(`/v1/books/${id}/borrow`, {
      borrowed_by: borrowedBy,
      due_date: dueDate,
    });
    return {
      success: true,
      message: 'Book borrowed successfully',
      data: transformBook(response.data?.data || response.data)
    };
  },

  /**
   * Return borrowed book
   */
  async returnBook(id: string): Promise<ApiResponse<Book>> {
    const response = await apiClient.post(`/v1/books/${id}/return`);
    return {
      success: true,
      message: 'Book returned successfully',
      data: transformBook(response.data?.data || response.data)
    };
  },

  /**
   * Get timeline events for a book
   */
  async getBookTimeline(id: string): Promise<ApiResponse<any[]>> {
    const response = await apiClient.get(`/v1/books/${id}/timeline`);
    return {
      success: true,
      message: 'Timeline retrieved successfully',
      data: response.data
    };
  },
};
