import { apiClient } from '../apiClient';

export interface ReadingSession {
  id: string;
  user_id: string;
  book_id: string;
  start_time: string;
  end_time: string | null;
  start_page: number;
  end_page: number | null;
  duration: number | null;
  mood: 'great' | 'good' | 'okay' | 'difficult' | null;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  book?: {
    id: string;
    title: string;
    author: string;
    pages: number;
  };
}

export interface ReadingSessionStatistics {
  total_sessions: number;
  total_duration_seconds: number;
  total_duration_formatted: string;
  total_pages_read: number;
  average_reading_speed_pages_per_hour: number;
}

export interface StartSessionData {
  start_page: number;
  mood?: 'great' | 'good' | 'okay' | 'difficult';
  location?: string;
}

export interface EndSessionData {
  end_page: number;
  notes?: string;
}

export interface BookReadingSessionsResponse {
  sessions: ReadingSession[];
  statistics: ReadingSessionStatistics;
}

export const readingSessionsApi = {
  /**
   * Start a new reading session for a book
   */
  async startSession(bookId: string, data: StartSessionData): Promise<ReadingSession> {
    console.log('Starting reading session for book:', bookId, data);

    const response = await apiClient.post(`/v1/books/${bookId}/reading-sessions/start`, data);
    console.log('Reading session started:', response);

    return response.data || response;
  },

  /**
   * End a reading session
   */
  async endSession(bookId: string, sessionId: string, data: EndSessionData): Promise<ReadingSession> {
    console.log('Ending reading session:', sessionId, data);

    const response = await apiClient.put(`/v1/books/${bookId}/reading-sessions/${sessionId}/end`, data);
    console.log('Reading session ended:', response);

    return response.data || response;
  },

  /**
   * Get all reading sessions for a book
   */
  async getBookSessions(bookId: string): Promise<BookReadingSessionsResponse> {
    console.log('Getting reading sessions for book:', bookId);

    const response = await apiClient.get(`/v1/books/${bookId}/reading-sessions`);
    console.log('Reading sessions retrieved:', response);

    return response.data || response;
  },

  /**
   * Read Again - Restart a finished book
   */
  async readAgain(bookId: string): Promise<any> {
    console.log('Restarting book:', bookId);

    const response = await apiClient.post(`/v1/books/${bookId}/read-again`);
    console.log('Book restarted:', response);

    return response.data || response;
  },
};