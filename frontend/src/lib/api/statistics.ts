import { apiClient } from '../apiClient';

export const statisticsApi = {
  getStatistics: async () => {
    return await apiClient.get('/v1/statistics');
  }
};
