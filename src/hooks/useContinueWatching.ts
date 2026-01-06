import { useState, useEffect, useCallback } from 'react';
import type { BaseMediaItem } from '../api/types';

const KEY = 'drama-stream-history';

export interface HistoryItem extends BaseMediaItem {
  lastEpisode: string;
  lastEpisodeId: string;
  timestamp: number;
}

export function useContinueWatching() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveHistory = useCallback((item: BaseMediaItem, episode: string, episodeId: string) => {
    setHistory((prev) => {
      // Avoid state update if top item is already the same (prevents double effect)
      if (prev.length > 0 && prev[0].id === item.id && prev[0].provider === item.provider && prev[0].lastEpisodeId === episodeId) {
          return prev;
      }

      // Remove existing entry for same ID
      const filtered = prev.filter((i) => !(i.id === item.id && i.provider === item.provider));
      // Add new to top
      const newItem: HistoryItem = {
        ...item,
        lastEpisode: episode,
        lastEpisodeId: episodeId,
        timestamp: Date.now(),
      };
      const newHistory = [newItem, ...filtered].slice(0, 20); // Keep max 20
      localStorage.setItem(KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const removeFromHistory = useCallback((id: string, provider: string) => {
      setHistory((prev) => {
          const newHistory = prev.filter((i) => !(i.id === id && i.provider === provider));
          localStorage.setItem(KEY, JSON.stringify(newHistory));
          return newHistory;
      });
  }, []);

  return { history, saveHistory, removeFromHistory };
}
