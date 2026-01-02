import { apiClient } from '../client';
import { normalizeNetshort } from '../normalizers';
import type { BaseMediaItem, NetshortItem } from '../types';

export const netshortService = {
  getTheaters: async (): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<NetshortItem[]>('/netshort/theaters');
    return data.map(normalizeNetshort);
  },
  getForYou: async (): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<NetshortItem[]>('/netshort/foryou');
    return data.map(normalizeNetshort);
  },
  search: async (query: string): Promise<BaseMediaItem[]> => {
    const { data } = await apiClient.get<NetshortItem[]>(`/netshort/search?query=${encodeURIComponent(query)}`);
    return data.map(normalizeNetshort);
  },
  getAllEpisodes: async (id: string): Promise<any[]> => {
    // NetShort might use 'drama_id'
    const { data } = await apiClient.get<any[]>(`/netshort/allepisode?drama_id=${id}`);
    return data;
  }
};
