import { apiClient } from '../apiClient';

export interface UserProgress {
  current: number;
  unlocked: boolean;
  unlocked_date: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  category: 'books' | 'reading' | 'collections' | 'streaks' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  user_progress: UserProgress;
}

export const achievementsApi = {
  /**
   * Get all achievements with user progress
   */
  async getAchievements(): Promise<Achievement[]> {
    const response = await apiClient.get('/v1/achievements');
    return response.data?.data || response.data || [];
  },

  /**
   * Unlock a specific achievement
   */
  async unlockAchievement(id: string): Promise<void> {
    await apiClient.post(`/v1/achievements/${id}/unlock`);
  }
};
