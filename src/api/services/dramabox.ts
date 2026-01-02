import { apiClient } from '../client';
import { normalizeDramabox } from '../normalizers';
import type { BaseMediaItem, MediaDetail, DramaboxItem } from '../types';

export const dramaboxService = {
  getVip: async (): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<DramaboxItem[]>('/dramabox/vip');
    return data.map(normalizeDramabox);
  },
  getDubIndo: async (): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<DramaboxItem[]>('/dramabox/dubindo');
    return data.map(normalizeDramabox);
  },
  getRandom: async (): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<DramaboxItem[]>('/dramabox/randomdrama');
    return data.map(normalizeDramabox);
  },
  getForYou: async (): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<DramaboxItem[]>('/dramabox/foryou');
    return data.map(normalizeDramabox);
  },
  getLatest: async (): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<DramaboxItem[]>('/dramabox/latest');
    return data.map(normalizeDramabox);
  },
  getTrending: async (): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<DramaboxItem[]>('/dramabox/trending');
    return data.map(normalizeDramabox);
  },
  getPopularSearch: async (): Promise<string[]> => {
    // Assuming this returns a list of strings? Or items?
    // Fallback to simpler implementation if structure unknown
    const { data } = await apiClient.get<any>('/dramabox/populersearch');
    return data; 
  },
  search: async (query: string): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<DramaboxItem[]>(`/dramabox/search?query=${encodeURIComponent(query)}`);
    return data.map(normalizeDramabox);
  },
  getDetail: async (id: string): Promise<MediaDetail> => {
    // Note: API might expect 'id' or 'drama_id' in query or path?
    // Assumption: /dramabox/detail?id=...
    const { data } = await apiClient.get<any>(`/dramabox/detail?id=${id}`);
    
    // Transform detailed response
    return {
        ...normalizeDramabox(data),
        synopsis: data.synopsis || data.introduction,
        episodes: data.episodes || [], // This might need another call to /allepisode if not included
        // If /allepisode is separate, we might fetch it here in parallel if needed, 
        // but 'allepisode' endpoint exists, so we probably use that for the player list.
    };
  },
  getAllEpisodes: async (id: string): Promise<any[]> => {
      const { data } = await apiClient.get<any[]>(`/dramabox/allepisode?id=${id}`);
      return data;
  }
};
