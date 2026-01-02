import { apiClient } from '../client';
import { normalizeAnime } from '../normalizers';
import type { BaseMediaItem, AnimeItem } from '../types';

export const animeService = {
  getLatest: async (): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<AnimeItem[]>('/anime/latest');
    return data.map(normalizeAnime);
  },
  search: async (query: string): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<AnimeItem[]>(`/anime/search?query=${encodeURIComponent(query)}`);
    return data.map(normalizeAnime);
  },
  getDetail: async (url: string): Promise<any> => {
    const { data } = await apiClient.get<any>(`/anime/detail?url=${encodeURIComponent(url)}`);
    return data;
  },
  getMovie: async (): Promise<BaseMediaItem[]> => {
      const { data } = await apiClient.get<AnimeItem[]>('/anime/movie');
      return data.map(normalizeAnime);
  },
  getVideo: async (url: string): Promise<any> => {
      const { data } = await apiClient.get<any>(`/anime/getvideo?url=${encodeURIComponent(url)}`);
      return data;
  }
};
