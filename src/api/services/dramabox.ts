import { dramaboxClient } from '../client';
import { normalizeDramabox } from '../normalizers';
import type { BaseMediaItem, MediaDetail, DramaboxItem } from '../types';

export const dramaboxService = {
  getVip: async (): Promise<BaseMediaItem[]> => {
    const { data } = await dramaboxClient.get<DramaboxItem[]>('/dramabox/vip');
    console.log('Dramabox VIP Raw:', data);
    return data.map(normalizeDramabox);
  },
  getDubIndo: async (): Promise<BaseMediaItem[]> => {
    const { data } = await dramaboxClient.get<DramaboxItem[]>('/dramabox/dubindo');
    return data.map(normalizeDramabox);
  },
  getRandom: async (): Promise<BaseMediaItem[]> => {
    const { data } = await dramaboxClient.get<DramaboxItem[]>('/dramabox/randomdrama');
    return data.map(normalizeDramabox);
  },
  getForYou: async (): Promise<BaseMediaItem[]> => {
    const { data } = await dramaboxClient.get<DramaboxItem[]>('/dramabox/foryou');
    return data.map(normalizeDramabox);
  },
  getLatest: async (): Promise<BaseMediaItem[]> => {
    const { data } = await dramaboxClient.get<DramaboxItem[]>('/dramabox/latest');
    return data.map(normalizeDramabox);
  },
  getTrending: async (): Promise<BaseMediaItem[]> => {
    const { data } = await dramaboxClient.get<DramaboxItem[]>('/dramabox/trending');
    return data.map(normalizeDramabox);
  },
  getPopularSearch: async (): Promise<string[]> => {
    // Assuming this returns a list of strings? Or items?
    // Fallback to simpler implementation if structure unknown
    const { data } = await dramaboxClient.get<any>('/dramabox/populersearch');
    return data; 
  },
  search: async (query: string): Promise<BaseMediaItem[]> => {
    const { data } = await dramaboxClient.get<DramaboxItem[]>(`/dramabox/search?query=${encodeURIComponent(query)}`);
    return data.map(normalizeDramabox);
  },
  getDetail: async (id: string): Promise<MediaDetail> => {
    // Use params object to safe-guard encoding
    const { data } = await dramaboxClient.get<any>('/dramabox/detail', {
        params: { bookId: id } 
    });
    
    // Check if data is nested in 'data' prop (some APIs do this) or top level
    const responseData = data.data || data;
    
    // Context: The API returns { book: { ... }, chapterList: [ ... ] } usually
    const bookData = responseData.book || responseData; 
    const chapters = responseData.chapterList || [];

    return {
        ...normalizeDramabox(bookData),
        synopsis: bookData.introduction || bookData.synopsis,
        // Map chapterList to episodes directly to avoid extra API calls (and rate limits)
        episodes: chapters.map((ch: any) => ({
            id: ch.id || ch.chapterId,
            title: ch.name || ch.chapterName || `Episode ${ch.id || ch.chapterId}`,
            url: ch.mp4 || ch.url || ch.id, // Use direct MP4 if available!
            episode: ch.id || ch.chapterId
        })),
    };
  },
  getAllEpisodes: async (id: string): Promise<any[]> => {
      // Falback only if needed, but getDetail should handle it now
      const { data } = await dramaboxClient.get<any[]>('/dramabox/allepisode', {
          params: { id: id }
      });
      return data;
  }
};
