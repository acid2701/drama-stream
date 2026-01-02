import { apiClient } from '../client';
import { normalizeMelolo } from '../normalizers';
import type { BaseMediaItem, MeloloItem } from '../types';

export const meloloService = {
  getLatest: async (): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<MeloloItem[]>('/melolo/latest');
    return data.map(normalizeMelolo);
  },
  getTrending: async (): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<MeloloItem[]>('/melolo/trending');
    return data.map(normalizeMelolo);
  },
  search: async (query: string): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<MeloloItem[]>(`/melolo/search?query=${encodeURIComponent(query)}`);
    return data.map(normalizeMelolo);
  },
  getDetail: async (id: string): Promise<any> => {
    const { data } = await apiClient.get<any>(`/melolo/detail?id=${id}`);
    return data;
  },
  getStream: async (id: string, episode: string): Promise<any> => {
      // Assuming structure for stream fetch
      const { data } = await apiClient.get<any>(`/melolo/stream?id=${id}&episode=${episode}`);
      return data;
  }
};
